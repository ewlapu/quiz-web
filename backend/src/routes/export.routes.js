const express = require('express');
const router = express.Router();
const exportController = require('../controllers/export.controller');
const { authRequired, authorizeRoles } = require('../middlewares/auth');

router.use(authRequired);
router.use(authorizeRoles('admin'));

router.get('/users.xlsx', exportController.exportUsers);
router.get('/exams.xlsx', exportController.exportExams);
router.get('/attempts.xlsx', exportController.exportAttempts);

module.exports = router;
