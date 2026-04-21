const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const subjectRoutes = require('./subject.routes');
const questionRoutes = require('./question.routes');
const examRoutes = require('./exam.routes');
const attemptRoutes = require('./attempt.routes');
const exportRoutes = require('./export.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/subjects', subjectRoutes);
router.use('/questions', questionRoutes);
router.use('/exams', examRoutes);
router.use('/attempts', attemptRoutes);
router.use('/export', exportRoutes);

module.exports = router;
