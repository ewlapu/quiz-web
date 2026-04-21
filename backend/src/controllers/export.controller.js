const ExcelJS = require('exceljs');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Attempt = require('../models/Attempt');

exports.exportUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'ID', key: '_id', width: 30 },
      { header: 'Full Name', key: 'fullName', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];

    users.forEach(user => {
      worksheet.addRow({
        _id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.exportExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('subjectId', 'name')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Exams');

    worksheet.columns = [
      { header: 'ID', key: '_id', width: 30 },
      { header: 'Title', key: 'title', width: 40 },
      { header: 'Subject', key: 'subject', width: 30 },
      { header: 'Question Count', key: 'questionCount', width: 15 },
      { header: 'Time Limit (min)', key: 'timeLimit', width: 15 },
      { header: 'Published', key: 'isPublished', width: 15 },
      { header: 'Created By', key: 'createdBy', width: 30 },
      { header: 'Created At', key: 'createdAt', width: 20 }
    ];

    exams.forEach(exam => {
      worksheet.addRow({
        _id: exam._id.toString(),
        title: exam.title,
        subject: exam.subjectId?.name || 'N/A',
        questionCount: exam.questionIds.length,
        timeLimit: exam.timeLimit,
        isPublished: exam.isPublished ? 'Yes' : 'No',
        createdBy: exam.createdBy?.fullName || 'N/A',
        createdAt: exam.createdAt
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=exams.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.exportAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find()
      .populate('userId', 'fullName email')
      .populate('examId', 'title')
      .sort({ submittedAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attempts');

    worksheet.columns = [
      { header: 'ID', key: '_id', width: 30 },
      { header: 'User', key: 'user', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Exam', key: 'exam', width: 40 },
      { header: 'Score', key: 'score', width: 15 },
      { header: 'Submitted At', key: 'submittedAt', width: 20 }
    ];

    attempts.forEach(attempt => {
      worksheet.addRow({
        _id: attempt._id.toString(),
        user: attempt.userId?.fullName || 'N/A',
        email: attempt.userId?.email || 'N/A',
        exam: attempt.examId?.title || 'N/A',
        score: attempt.score.toFixed(2),
        submittedAt: attempt.submittedAt
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=attempts.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
