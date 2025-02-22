require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
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
const poseRoutes = require('./routes/poseRoutes');

require("./utils/passport.js");

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Database connection
connectDB();

// Middleware setup with consolidated and optimized configurations
app.use(sessionMiddleware);
app.use(corsMiddleware);

// Improved body parsing with higher limits and proper configuration
app.use(bodyParser.json({
  limit: '500mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(bodyParser.urlencoded({ 
  limit: '500mb', 
  extended: true 
}));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Socket.IO setup
const io = require("socket.io")(server, { 
  cors: { 
    origin: "*", 
    methods: ["GET", "POST"] 
  },
  maxHttpBufferSize: 1e8 // Increase buffer size to 100MB
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/addlocation', locationRoutes);
app.use('/api/pose', poseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", { 
      signal: data.signalData, 
      from: data.from, 
      name: data.name 
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
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
  // Optionally log to an error tracking service
  // process.exit(1); // Uncomment in production if you want to crash on unhandled rejections
});