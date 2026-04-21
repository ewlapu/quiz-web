const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateUpdateProfile } = require('../validators/auth.validator');
const { authRequired } = require('../middlewares/auth');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', authRequired, authController.getMe);
router.put('/me', authRequired, validateUpdateProfile, authController.updateMe);

module.exports = router;
