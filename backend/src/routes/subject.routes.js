const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');
const { validateSubject } = require('../validators/subject.validator');
const { authRequired, authorizeRoles } = require('../middlewares/auth');

router.get('/', authRequired, subjectController.getSubjects);

router.use(authRequired);
router.use(authorizeRoles('admin'));

router.post('/', validateSubject, subjectController.createSubject);
router.put('/:id', validateSubject, subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
