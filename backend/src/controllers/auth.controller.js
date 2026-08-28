const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const db = require('../db/db.service');

// Helper to validate email format
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Register User
const register = async (req, res, next) => {
  try {
    const { email, password, fullName, orgName, role = 'candidate' } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (!['candidate', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Role must be candidate or admin.'
      });
    }

    // 2. Duplicate Email Check
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // 3. Password Hashing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Create User & Profile
    const newUser = await db.createUser({
      email,
      passwordHash,
      role,
      fullName,
      orgName
    });

    // 5. Fetch Profile Details
    const profile = role === 'candidate' 
      ? await db.getCandidateProfile(newUser.id)
      : await db.getOrganizationProfile(newUser.id);

    // 6. Generate JWT Token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: profile?.full_name || profile?.org_name || fullName || 'User',
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login User
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.'
      });
    }

    // 2. User Lookup
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // 3. Password Comparison
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.'
      });
    }

    // 4. Fetch Profile Details
    const profile = user.role === 'candidate'
      ? await db.getCandidateProfile(user.id)
      : await db.getOrganizationProfile(user.id);

    // 5. Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: profile?.full_name || profile?.org_name || 'User',
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Current Logged-in User Info (/api/auth/me)
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User session not found.'
      });
    }

    const profile = user.role === 'candidate'
      ? await db.getCandidateProfile(user.id)
      : await db.getOrganizationProfile(user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: profile?.full_name || profile?.org_name || 'User',
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
