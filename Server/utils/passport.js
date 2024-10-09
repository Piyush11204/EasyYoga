require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_KEY,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
      callbackURL: "http://localhost:8080/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: email,
        photos: profile.photos,
        
      };
      console.log("User Info from Google:", user);
      return done(null, user);
      
      
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
