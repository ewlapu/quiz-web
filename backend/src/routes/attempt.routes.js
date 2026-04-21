const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attempt.controller');
const { validateAttempt } = require('../validators/attempt.validator');
const { authRequired, authorizeRoles } = require('../middlewares/auth');

router.use(authRequired);

router.post('/', validateAttempt, attemptController.submitAttempt);
router.get('/me', attemptController.getMyAttempts);

router.get('/', authorizeRoles('admin', 'teacher'), attemptController.getAllAttempts);
router.get('/:id', attemptController.getAttemptById);
router.delete('/:id', authorizeRoles('admin'), attemptController.deleteAttempt);

module.exports = router;
