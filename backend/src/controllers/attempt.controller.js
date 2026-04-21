const Attempt = require('../models/Attempt');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

exports.submitAttempt = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    const exam = await Exam.findById(examId).populate('questionIds');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (!exam.isPublished) {
      return res.status(403).json({ message: 'Exam is not published' });
    }

    const questionMap = {};
    exam.questionIds.forEach(q => {
      questionMap[q._id.toString()] = q.correctOption;
    });

    let correctCount = 0;
    answers.forEach(answer => {
      const correctOption = questionMap[answer.questionId];
      if (correctOption && answer.selectedOption === correctOption) {
        correctCount++;
      }
    });

    const score = (correctCount / exam.questionIds.length) * 100;

    const attempt = await Attempt.create({
      userId: req.user._id,
      examId,
      answers,
      score
    });

    const populatedAttempt = await Attempt.findById(attempt._id)
      .populate('userId', 'fullName email')
      .populate('examId', 'title timeLimit');

    res.status(201).json({
      message: 'Attempt submitted successfully',
      attempt: populatedAttempt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyAttempts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const attempts = await Attempt.find({ userId: req.user._id })
      .populate('examId', 'title')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ submittedAt: -1 });

    const total = await Attempt.countDocuments({ userId: req.user._id });

    res.json({
      attempts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllAttempts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'teacher') {
      const exams = await Exam.find({ createdBy: req.user._id }).select('_id');
      const examIds = exams.map(e => e._id);
      query.examId = { $in: examIds };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const attempts = await Attempt.find(query)
      .populate('userId', 'fullName email')
      .populate('examId', 'title')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ submittedAt: -1 });

    const total = await Attempt.countDocuments(query);

    res.json({
      attempts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;

    const attempt = await Attempt.findById(id)
      .populate('userId', 'fullName email')
      .populate('examId', 'title createdBy')
      .populate('answers.questionId');

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    if (req.user.role === 'user') {
      if (attempt.userId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else if (req.user.role === 'teacher') {
      const exam = await Exam.findById(attempt.examId._id);
      if (exam.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json({ attempt });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteAttempt = async (req, res) => {
  try {
    const { id } = req.params;

    const attempt = await Attempt.findByIdAndDelete(id);

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found' });
    }

    res.json({ message: 'Attempt deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
