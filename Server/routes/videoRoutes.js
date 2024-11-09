const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const sessionMiddleware = require('../middleware/session.js');

// Create a new room with session middleware
router.post('/create-room', sessionMiddleware, videoController.createRoom);

// Validate if the room exists with session middleware
router.get('/validate-room/:roomCode', sessionMiddleware, videoController.validateRoom);

module.exports = router;
