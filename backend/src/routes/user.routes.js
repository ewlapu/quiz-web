const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateCreateUser, validateUpdateUser } = require('../validators/user.validator');
const { authRequired, authorizeRoles } = require('../middlewares/auth');

router.use(authRequired);
router.use(authorizeRoles('admin'));

router.get('/', userController.getUsers);
router.post('/', validateCreateUser, userController.createUser);
router.put('/:id', validateUpdateUser, userController.updateUser);
router.patch('/:id/lock', userController.lockUser);
router.patch('/:id/unlock', userController.unlockUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
