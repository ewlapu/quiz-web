const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');
const { validateExam } = require('../validators/exam.validator');
const { authRequired, authorizeRoles } = require('../middlewares/auth');

router.get('/public', authRequired, examController.getPublicExams);
router.get('/:id/public', authRequired, examController.getPublicExamDetail);

router.use(authRequired);
router.use(authorizeRoles('admin', 'teacher'));

router.get('/', examController.getExams);
router.post('/', validateExam, examController.createExam);
router.put('/:id', validateExam, examController.updateExam);
router.delete('/:id', examController.deleteExam);
router.patch('/:id/publish', examController.publishExam);
router.patch('/:id/unpublish', examController.unpublishExam);

module.exports = router;
