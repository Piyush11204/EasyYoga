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

require("./utils/passport.js");
const app = express();

// Database connection
connectDB();

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/addlocation', locationRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
