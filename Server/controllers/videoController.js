const crypto = require('crypto');
const { rooms } = require('../utils/roomManager');

const videoController = {
    createRoom: (req, res) => {
        const roomCode = crypto.randomBytes(3).toString('hex');
        rooms.set(roomCode, { participants: new Set() });
        res.json({ roomCode });
    },

    validateRoom: (req, res) => {
        const { roomCode } = req.params;
        const room = rooms.get(roomCode);
        if (room) {
            res.json({ valid: true, participantCount: room.participants.size });
        } else {
            res.json({ valid: false });
        }
    }
};

module.exports = videoController;