const { rooms, leaveRoom } = require('./roomManager');
const crypto = require('crypto');

const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('create-room', () => {
            const roomCode = crypto.randomBytes(3).toString('hex');
            rooms.set(roomCode, { host: socket.id, participants: new Set([socket.id]) });
            socket.join(roomCode);
            socket.emit('room-created', { roomCode });
            console.log(`Room created: ${roomCode}`);
        });

        socket.on('join-room', ({ roomCode }) => {
            const room = rooms.get(roomCode);
            if (room) {
                room.participants.add(socket.id);
                socket.join(roomCode);
                socket.emit('room-joined', { roomCode });
                socket.to(roomCode).emit('user-joined', { userId: socket.id });
                console.log(`User ${socket.id} joined room ${roomCode}`);
            } else {
                socket.emit('room-error', { message: 'Room not found' });
            }
        });

        socket.on('signal', ({ roomCode, signalData, targetUserId }) => {
            const room = rooms.get(roomCode);
            if (room && room.participants.has(socket.id)) {
                if (targetUserId) {
                    socket.to(targetUserId).emit('signal', {
                        userId: socket.id,
                        signalData
                    });
                } else {
                    socket.to(roomCode).emit('signal', {
                        userId: socket.id,
                        signalData
                    });
                }
            }
        });

        socket.on('leave-room', ({ roomCode }) => {
            leaveRoom(socket, roomCode, io);
        });

        socket.on('disconnect', () => {
            rooms.forEach((room, roomCode) => {
                if (room.participants.has(socket.id)) {
                    leaveRoom(socket, roomCode, io);
                }
            });
            console.log('Client disconnected:', socket.id);
        });
    });
};

module.exports = setupSocketHandlers;