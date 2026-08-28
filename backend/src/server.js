const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const errorHandler = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');
const resumeRoutes = require('./routes/resume.routes');
const jobRoutes = require('./routes/job.routes');
const diagnosisRoutes = require('./routes/diagnosis.routes');
const actionPlanRoutes = require('./routes/actionPlan.routes');
const interviewRoutes = require('./routes/interview.routes');
const progressRoutes = require('./routes/progress.routes');

const app = express();

// CORS setup
app.use(cors({
  origin: env.CLIENT_URL || '*',
  credentials: true
}));

// Express json & urlencoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    product: 'SkillBridge API Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/action-plan', actionPlanRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/progress', progressRoutes);

// Default root response
app.get('/', (req, res) => {
  res.send('SkillBridge API Service is running.');
});

// Global Error Handler
app.use(errorHandler);

// Start server if executed directly
if (require.main === module) {
  const PORT = env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` SkillBridge Backend API Server running on port ${PORT}`);
    console.log(` Environment: ${env.NODE_ENV}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

module.exports = app;
