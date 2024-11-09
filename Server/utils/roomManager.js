// roomManager.js

const rooms = new Map();

const leaveRoom = (socket, roomCode, io) => {
    const room = rooms.get(roomCode);
    if (room && room.participants.has(socket.id)) {
        room.participants.delete(socket.id);
        socket.leave(roomCode);
        console.log(`User ${socket.id} left room ${roomCode}`);

        // Notify other participants
        socket.to(roomCode).emit('user-left', { userId: socket.id });

        // Check if room is empty and delete it
        if (room.participants.size === 0) {
            rooms.delete(roomCode);
            console.log(`Room ${roomCode} deleted`);
        }
    }
};

module.exports = { rooms, leaveRoom };
