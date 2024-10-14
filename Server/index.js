require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const connectDB = require("./DB/db");
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/addLocation');
const session = require("express-session");
const passport = require("passport");
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

require("./utils/passport.js");
const app = express();

// Database connection
connectDB();

// Session middleware
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 20 * 60 * 1000,    
      },
    })
);

// Middleware
app.use(
    cors({
      origin: "http://localhost:3000",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' })); // Increase body size limit if necessary
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Pose Analysis Route
app.post('/api/analyze-pose', (req, res) => {
    const { frame } = req.body;

    const pythonProcess = spawn('python', ['yoga_pose_analysis.py']);

    let result = '';

    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Python script exited with error' });
        }
        res.json({ processedFrame: result.trim() });
    });

    pythonProcess.stdin.write(JSON.stringify({ frame }));
    pythonProcess.stdin.end();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/addlocation', locationRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
