// Server.js

require('dotenv').config();

// Production-ready: REMOVE sensitive console.logs
// console.log("💡 PAYSTACK_SECRET =", process.env.PAYSTACK_SECRET); // <--- REMOVED FOR PRODUCTION

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const multer = require('multer');

// Logging library for production (e.g., Winston)
const winston = require('winston');
const expressWinston = require('express-winston');

// User model
const User = require('./models/user');
// Routes
const campaignRoutes = require('./routes/campaignRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const webhookRoute = require('./routes/webhookRoutes');
const paystackRoutes = require('./routes/paystackRoutes');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port

// --- Winston Logger Setup ---
// Transports define where logs go (console, file, etc.)
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  // In a real production app, you'd add a file transport or a centralized logging service
  // new winston.transports.File({ filename: 'combined.log' }),
  // new winston.transports.File({ filename: 'errors.log', level: 'error' }),
];

// Logger for general application logs
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Log 'info' and above in production
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // JSON format is good for machine readability in production
  ),
  transports: transports,
  exitOnError: false, // Do not exit on handled exceptions
});

// Express-Winston for request logging
app.use(expressWinston.logger({
  transports: transports,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  meta: true, // Log metadata about the request (req.body, req.headers, etc.)
  msg: "HTTP {{req.method}} {{req.url}}", // Customize the log message
  expressFormat: true, // Use a more standardized format for Express logs
  colorize: false, // Don't colorize logs in production files
  ignoreRoute: function (req, res) { return false; } // Log all requests
}));
// --- End Winston Logger Setup ---


// Enable CORS to allow frontend communication
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // Use env var for client origin
  credentials: true
}));

// Middleware to parse JSON and URL-encoded data
// Increased payload size limits - Reconsider `50mb` if not strictly for large base64 images
app.use(express.json({ limit: process.env.JSON_PAYLOAD_LIMIT || '10mb' })); // Reduced default limit
app.use(express.urlencoded({ extended: true, limit: process.env.URLENCODED_PAYLOAD_LIMIT || '10mb' })); // Reduced default limit


// Session middleware
const MongoStore = require('connect-mongo');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production with https
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'Lax' // Recommended for CSRF protection with cross-site requests
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback" // Use env var
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        role: "user"
      });
      await user.save();
      logger.info(`New user registered via Google OAuth: ${user.email}`);
    } else {
      logger.info(`Existing user logged in via Google OAuth: ${user.email}`);
    }
    return done(null, user);
  } catch (err) {
    logger.error(`Error during Google OAuth authentication for profile ${profile.id}:`, err);
    return done(err, null);
  }
}));

// Serialize & Deserialize user for session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      logger.warn(`Attempted to deserialize non-existent user with ID: ${id}`);
      return done(null, false); // User not found, indicate failure
    }
    done(null, user);
  } catch (err) {
    logger.error(`Error deserializing user with ID: ${id}:`, err);
    done(err, null);
  }
});

// Setup multer for handling file uploads (Local storage is fine for project, but note production alternative)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads', 'avatar');
    // Ensure the directory exists
    require('fs').mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // More robust filename
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB (example)
  fileFilter: (req, file, cb) => {
    // Only allow specific image types
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!'));
    }
  }
});
// Attach `upload` to app.locals or export it if used in routes directly
app.locals.upload = upload; // Access via req.app.locals.upload in routes


// Routes
app.use('/campaigns', campaignRoutes);
app.use('/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/webhook', webhookRoute);
app.use('/api/paystack', paystackRoutes);

// Root route (place after API routes to avoid conflicts)
app.get('/', (req, res) => {
  res.send('Welcome to the Crowdfunding App Backend API!');
  logger.info('Root path accessed.');
});

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.CLIENT_LOGIN_URL || 'http://localhost:5173/login' }), // Use env var for client redirect
  (req, res) => {
    logger.info(`Google OAuth successful for user: ${req.user ? req.user.email : 'Unknown'}`);
    res.redirect(process.env.CLIENT_SUCCESS_URL || 'http://localhost:5173'); // Use env var for client redirect
  }
);

// Logout route
app.get('/logout', (req, res, next) => { // Add next for error handling
  req.logout((err) => {
    if (err) {
      logger.error('Error during logout:', err);
      return next(err); // Pass error to error handling middleware
    }
    req.session.destroy((err) => { // Destroy session on logout
      if (err) {
        logger.error('Error destroying session during logout:', err);
        return next(err);
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      logger.info('User logged out and session destroyed.');
      res.status(200).json({ message: "Logged out successfully!" }); // Use JSON response
    });
  });
});

// Get current user session
app.get('/current_user', (req, res) => {
  if (req.user) {
    logger.debug(`Current user session accessed: ${req.user.email}`);
    res.json({ user: req.user });
  } else {
    logger.debug('Current user session accessed: No user logged in.');
    res.json({ user: null });
  }
});

// Serve uploaded images (Make sure this path is public if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info('✅ MongoDB Connected'))
  .catch(err => {
    logger.error("❌ MongoDB Connection Error:", err);
    // In a production environment, a failed DB connection is fatal.
    // It's often better to exit the process and rely on a process manager (e.g., PM2, Kubernetes)
    // to restart the application.
    process.exit(1); // Exit with a non-zero code to indicate an error
  });

// --- Centralized Error Handling Middleware (MUST BE LAST MIDDLEWARE) ---
app.use((err, req, res, next) => {
  // Log the error using Winston
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, err);

  // Default error message
  let errorMessage = 'Something went wrong on the server.';
  let statusCode = 500;

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413; // Payload Too Large
      errorMessage = 'File size exceeds the allowed limit (10MB).';
    } else {
      statusCode = 400; // Bad Request
      errorMessage = `File upload error: ${err.message}`;
    }
  } else if (err.name === 'ValidationError') { // Mongoose validation errors
    statusCode = 400;
    errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') { // Invalid ObjectId
    statusCode = 400;
    errorMessage = `Invalid ID format for ${err.path}: ${err.value}`;
  } else if (err.status) { // Custom errors with a status property
    statusCode = err.status;
    errorMessage = err.message;
  }

  // Only send stack trace in development
  res.status(statusCode).json({
    message: errorMessage,
    // Include stack trace only if not in production for debugging
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Express-Winston error logger (MUST BE AFTER ROUTES AND BEFORE CUSTOM ERROR HANDLER)
app.use(expressWinston.errorLogger({
  transports: transports,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
}));
// --- End Centralized Error Handling Middleware ---


app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});