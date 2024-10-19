const rooms = new Map();

const leaveRoom = (socket, roomCode, io) => {
    const room = rooms.get(roomCode);
    if (room) {
        room.participants.delete(socket.id);
        socket.to(roomCode).emit('user-left', { userId: socket.id });
        
        if (room.participants.size === 0) {
            rooms.delete(roomCode);
            console.log(`Room ${roomCode} deleted`);
        } else if (room.host === socket.id) {
            const [newHost] = room.participants;
            room.host = newHost;
            io.to(roomCode).emit('new-host', { hostId: newHost });
        }
        
        socket.leave(roomCode);
        console.log(`User ${socket.id} left room ${roomCode}`);
    }
};

module.exports = { rooms, leaveRoom };