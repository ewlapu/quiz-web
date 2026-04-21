const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { validateQuestion } = require('../validators/question.validator');
const { authRequired, authorizeRoles } = require('../middlewares/auth');

router.use(authRequired);
router.use(authorizeRoles('admin', 'teacher'));

router.get('/', questionController.getQuestions);
router.post('/', validateQuestion, questionController.createQuestion);
router.put('/:id', validateQuestion, questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
