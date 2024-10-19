const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/create-room', videoController.createRoom);
router.get('/validate-room/:roomCode', videoController.validateRoom);

module.exports = router;