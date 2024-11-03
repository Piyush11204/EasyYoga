require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require("./DB/db");
const passport = require("passport");
const bodyParser = require('body-parser');

// Import middleware
const sessionMiddleware = require('./middleware/session');
const corsMiddleware = require('./middleware/cors');

// Import routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/addLocation');
const videoRoutes = require('./routes/videoRoutes');
const poseRoutes = require('./routes/poseRoutes');

// Import socket handler
const setupSocketHandlers = require('./utils/socketHandler');

// Initialize passport config
require("./utils/passport.js");

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Database connection
connectDB();

// Middleware setup
app.use(sessionMiddleware);
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Setup socket handlers
setupSocketHandlers(io);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/addlocation', locationRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/pose', poseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server and Socket.IO listening on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // In production, you might want to crash the process
    // process.exit(1);
});