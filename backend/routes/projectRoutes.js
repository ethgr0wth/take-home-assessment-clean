const express = require('express');
const projectController = require('../controllers/projectController');
const { validateProjectBody } = require('../middleware');

const router = express.Router();

router.get('/', projectController.listProjects);
router.get('/:id', projectController.getProject);
router.post('/', validateProjectBody, projectController.createProject);

module.exports = router;
