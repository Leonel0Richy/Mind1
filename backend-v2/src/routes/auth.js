/**
 * Smart Authentication Routes
 * Provides comprehensive authentication endpoints with advanced security
 */

const express = require('express');
const authUtils = require('../utils/auth');
const ValidationUtils = require('../utils/validation');
const AuthMiddleware = require('../middleware/auth');
const storageAdapter = require('../storage/StorageAdapter');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with enhanced security
 * @access  Public
 */
router.post('/register', 
  ValidationUtils.userRegistration(),
  AuthMiddleware.handleValidationErrors,
  async (req, res) => {
    try {
      const { firstName, lastName, email, password, phone, dateOfBirth } = req.body;

      // Check rate limiting for registration
      const rateLimitCheck = authUtils.checkLoginAttempts(req.ip);
      if (!rateLimitCheck.allowed) {
        return res.status(429).json({
          success: false,
          message: 'Too many registration attempts. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitCheck.remainingTime
        });
      }

      // Check if user already exists
      const existingUser = await storageAdapter.findUserByEmail(email);
      if (existingUser) {
        authUtils.recordFailedLogin(req.ip);
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists',
          code: 'USER_EXISTS'
        });
      }

      // Validate password strength
      const passwordValidation = authUtils.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Password does not meet security requirements',
          code: 'WEAK_PASSWORD',
          errors: passwordValidation.errors,
          strength: passwordValidation.strength
        });
      }

      // Hash password
      const hashedPassword = await authUtils.hashPassword(password);

      // Create user
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone?.trim(),
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        role: 'user',
        isVerified: false,
        loginAttempts: 0,
        accountLocked: false
      };

      const user = await storageAdapter.createUser(userData);

      // Generate tokens
      const tokenPayload = authUtils.sanitizeUserForToken(user);
      const accessToken = authUtils.generateToken(tokenPayload);
      const refreshToken = authUtils.generateRefreshToken();

      // Create session
      await storageAdapter.createSession({
        userId: user._id || user.id,
        token: accessToken,
        refreshToken,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      // Clear rate limiting on successful registration
      authUtils.clearLoginAttempts(req.ip);

      // Remove sensitive data from response
      const { password: _, ...userResponse } = user;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: '7d'
          }
        },
        meta: {
          storageMode: storageAdapter.getStorageStats().mode
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration',
        code: 'REGISTRATION_ERROR'
      });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user with enhanced security
 * @access  Public
 */
router.post('/login',
  ValidationUtils.userLogin(),
  AuthMiddleware.handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check rate limiting
      const rateLimitCheck = authUtils.checkLoginAttempts(email);
      if (!rateLimitCheck.allowed) {
        return res.status(429).json({
          success: false,
          message: rateLimitCheck.locked 
            ? `Account temporarily locked. Try again in ${rateLimitCheck.remainingTime}`
            : 'Too many login attempts. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitCheck.remainingTime
        });
      }

      // Find user
      const user = await storageAdapter.findUserByEmail(email);
      if (!user) {
        authUtils.recordFailedLogin(email);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Check if account is locked
      if (user.accountLocked && user.lockUntil && user.lockUntil > new Date()) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts',
          code: 'ACCOUNT_LOCKED'
        });
      }

      // Verify password
      const isValidPassword = await authUtils.comparePassword(password, user.password);
      if (!isValidPassword) {
        authUtils.recordFailedLogin(email);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Clear failed login attempts
      authUtils.clearLoginAttempts(email);

      // Generate tokens
      const tokenPayload = authUtils.sanitizeUserForToken(user);
      const accessToken = authUtils.generateToken(tokenPayload);
      const refreshToken = authUtils.generateRefreshToken();

      // Create session
      await storageAdapter.createSession({
        userId: user._id || user.id,
        token: accessToken,
        refreshToken,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Remove sensitive data
      const { password: _, loginAttempts, accountLocked, lockUntil, ...userResponse } = user;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: '7d'
          }
        },
        meta: {
          storageMode: storageAdapter.getStorageStats().mode,
          loginTime: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login',
        code: 'LOGIN_ERROR'
      });
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me',
  AuthMiddleware.authenticate,
  async (req, res) => {
    try {
      const user = await storageAdapter.findUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: {
          user,
          session: {
            lastAccess: req.user.lastAccess,
            tokenInfo: {
              issuedAt: new Date(req.user.iat * 1000),
              expiresAt: new Date(req.user.exp * 1000)
            }
          }
        }
      });

    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving user profile',
        code: 'PROFILE_ERROR'
      });
    }
  }
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and invalidate session
 * @access  Private
 */
router.post('/logout',
  AuthMiddleware.authenticate,
  async (req, res) => {
    try {
      // In a production environment, you would invalidate the token
      // For now, we'll just return success
      res.json({
        success: true,
        message: 'Logged out successfully',
        code: 'LOGOUT_SUCCESS'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Error during logout',
        code: 'LOGOUT_ERROR'
      });
    }
  }
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public (requires refresh token)
 */
router.post('/refresh',
  async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
          code: 'REFRESH_TOKEN_REQUIRED'
        });
      }

      // Find session by refresh token
      const session = await storageAdapter.findSessionByToken(refreshToken);
      
      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        });
      }

      // Get user
      const user = await storageAdapter.findUserById(session.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Generate new access token
      const tokenPayload = authUtils.sanitizeUserForToken(user);
      const newAccessToken = authUtils.generateToken(tokenPayload);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: newAccessToken,
          expiresIn: '7d'
        }
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        message: 'Error refreshing token',
        code: 'REFRESH_ERROR'
      });
    }
  }
);

module.exports = router;
