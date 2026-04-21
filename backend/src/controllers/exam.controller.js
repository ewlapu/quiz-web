const Exam = require('../models/Exam');
const Question = require('../models/Question');

exports.getExams = async (req, res) => {
  try {
    const { subjectId, isPublished, createdBy, page = 1, limit = 10 } = req.query;
    const query = {};

    if (subjectId) query.subjectId = subjectId;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    if (createdBy) query.createdBy = createdBy;

    if (req.user.role === 'teacher') {
      query.createdBy = req.user._id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const exams = await Exam.find(query)
      .populate('subjectId', 'name')
      .populate('createdBy', 'fullName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Exam.countDocuments(query);

    res.json({
      exams,
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

exports.createExam = async (req, res) => {
  try {
    const { title, subjectId, questionIds, timeLimit } = req.body;

    const exam = await Exam.create({
      title,
      subjectId,
      questionIds,
      timeLimit,
      createdBy: req.user._id
    });

    const populatedExam = await Exam.findById(exam._id)
      .populate('subjectId', 'name')
      .populate('createdBy', 'fullName email');

    res.status(201).json({
      message: 'Exam created successfully',
      exam: populatedExam
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subjectId, questionIds, timeLimit } = req.body;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (req.user.role === 'teacher' && exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    exam.title = title || exam.title;
    exam.subjectId = subjectId || exam.subjectId;
    exam.questionIds = questionIds || exam.questionIds;
    exam.timeLimit = timeLimit || exam.timeLimit;

    await exam.save();

    const populatedExam = await Exam.findById(exam._id)
      .populate('subjectId', 'name')
      .populate('createdBy', 'fullName email');

    res.json({
      message: 'Exam updated successfully',
      exam: populatedExam
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (req.user.role === 'teacher' && exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Exam.findByIdAndDelete(id);

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.publishExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (req.user.role === 'teacher' && exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    exam.isPublished = true;
    await exam.save();

    const populatedExam = await Exam.findById(exam._id)
      .populate('subjectId', 'name')
      .populate('createdBy', 'fullName email');

    res.json({
      message: 'Exam published successfully',
      exam: populatedExam
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.unpublishExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (req.user.role === 'teacher' && exam.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    exam.isPublished = false;
    await exam.save();

    const populatedExam = await Exam.findById(exam._id)
      .populate('subjectId', 'name')
      .populate('createdBy', 'fullName email');

    res.json({
      message: 'Exam unpublished successfully',
      exam: populatedExam
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPublicExams = async (req, res) => {
  try {
    const { subjectId, search, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };

    if (subjectId) query.subjectId = subjectId;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const exams = await Exam.find(query)
      .populate('subjectId', 'name')
      .select('-questionIds')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Exam.countDocuments(query);

    res.json({
      exams,
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

exports.getPublicExamDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id)
      .populate('subjectId', 'name')
      .populate({
        path: 'questionIds',
        select: '-correctOption'
      });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (!exam.isPublished) {
      return res.status(403).json({ message: 'Exam is not published' });
    }

    res.json({ exam });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
