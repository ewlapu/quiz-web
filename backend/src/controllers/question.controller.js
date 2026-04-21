const Question = require('../models/Question');

exports.getQuestions = async (req, res) => {
  try {
    const { search, subjectId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.content = { $regex: search, $options: 'i' };
    }

    if (subjectId) {
      query.subjectId = subjectId;
    }

    if (req.user.role === 'teacher') {
      query.createdBy = req.user._id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const questions = await Question.find(query)
      .populate('subjectId', 'name')
      .populate('createdBy', 'fullName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Question.countDocuments(query);

    res.json({
      questions,
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

exports.createQuestion = async (req, res) => {
  try {
    const { subjectId, content, options, correctOption } = req.body;

    const question = await Question.create({
      subjectId,
      content,
      options,
      correctOption,
      createdBy: req.user._id
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('subjectId', 'name')
      .populate('createdBy', 'fullName email');

    res.status(201).json({
      message: 'Question created successfully',
      question: populatedQuestion
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectId, content, options, correctOption } = req.body;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (req.user.role === 'teacher' && question.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    question.subjectId = subjectId || question.subjectId;
    question.content = content || question.content;
    question.options = options || question.options;
    question.correctOption = correctOption || question.correctOption;

    await question.save();

    const populatedQuestion = await Question.findById(question._id)
      .populate('subjectId', 'name')
      .populate('createdBy', 'fullName email');

    res.json({
      message: 'Question updated successfully',
      question: populatedQuestion
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (req.user.role === 'teacher' && question.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Question.findByIdAndDelete(id);

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
