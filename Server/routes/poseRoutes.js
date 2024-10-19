const express = require('express');
const router = express.Router();
const poseController = require('../controllers/poseController');

router.post('/analyze-pose', poseController.analyzePose);

module.exports = router;