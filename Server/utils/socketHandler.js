const { rooms, leaveRoom } = require('./roomManager');
const crypto = require('crypto');

const createRoom = (socket) => {
    const roomCode = crypto.randomBytes(3).toString('hex');
    rooms.set(roomCode, { host: socket.id, participants: new Set([socket.id]) });
    socket.join(roomCode);
    socket.emit('room-created', { roomCode });
    console.log(`Room created: ${roomCode}`);
};

const joinRoom = (socket, roomCode) => {
    const room = rooms.get(roomCode);
    if (room) {
        if (!room.participants.has(socket.id)) {
            room.participants.add(socket.id);
            socket.join(roomCode);
            socket.emit('room-joined', { roomCode });
            socket.to(roomCode).emit('user-joined', { userId: socket.id });
            console.log(`User ${socket.id} joined room ${roomCode}`);
        } else {
            socket.emit('room-error', { message: 'You are already in this room' });
        }
    } else {
        socket.emit('room-error', { message: 'Room not found' });
    }
};

const handleSignal = (socket, roomCode, signalData, targetUserId) => {
    const room = rooms.get(roomCode);
    if (room && room.participants.has(socket.id)) {
        if (targetUserId) {
            socket.to(targetUserId).emit('signal', {
                userId: socket.id,
                signalData,
            });
        } else {
            socket.to(roomCode).emit('signal', {
                userId: socket.id,
                signalData,
            });
        }
    } else {
        socket.emit('room-error', { message: 'You are not in this room' });
    }
};

const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Create a new room
        socket.on('create-room', () => createRoom(socket));

        // Join an existing room
        socket.on('join-room', ({ roomCode }) => joinRoom(socket, roomCode));

        // Handle signaling for WebRTC
        socket.on('signal', ({ roomCode, signalData, targetUserId }) => {
            handleSignal(socket, roomCode, signalData, targetUserId);
        });

        // Leave a room
        socket.on('leave-room', ({ roomCode }) => {
            leaveRoom(socket, roomCode, io);
        });

        // Handle disconnection
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
