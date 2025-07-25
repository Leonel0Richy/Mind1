const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const router = express.Router();

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'masterminds_secret_key_2025';

// In-memory storage for demo purposes when MongoDB is not available
let inMemoryUsers = [];
let userIdCounter = 1;

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please enter a valid phone number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, phone } = req.body;

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      // Use MongoDB
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const user = new User({
        firstName,
        lastName,
        email,
        password,
        phone
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      });
    } else {
      // Use in-memory storage for demo
      const existingUser = inMemoryUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = {
        id: userIdCounter++,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        createdAt: new Date()
      };

      inMemoryUsers.push(user);

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully (demo mode - in-memory storage)',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      });
    }

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/signin
// @desc    Authenticate user and get token
// @access  Public
router.post('/signin', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .exists()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      // Use MongoDB
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } else {
      // Use in-memory storage for demo
      const user = inMemoryUsers.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful (demo mode)',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: 'user'
        }
      });
    }

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const user = await User.findById(req.user.userId).select('-password');
      res.json({
        success: true,
        user
      });
    } else {
      // Use in-memory storage for demo
      const user = inMemoryUsers.find(u => u.id === req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const { password, ...userWithoutPassword } = user;
      res.json({
        success: true,
        user: userWithoutPassword
      });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
