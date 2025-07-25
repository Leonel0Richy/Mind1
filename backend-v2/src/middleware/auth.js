/**
 * Smart Authentication Middleware
 * Provides secure, flexible authentication with multiple strategies
 */

const authUtils = require('../utils/auth');
const storageAdapter = require('../storage/StorageAdapter');
const { validationResult } = require('express-validator');

class AuthMiddleware {
  /**
   * Main authentication middleware
   */
  static async authenticate(req, res, next) {
    try {
      // Extract token from various sources
      const token = AuthMiddleware.extractToken(req);
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.',
          code: 'NO_TOKEN'
        });
      }

      // Verify token
      const decoded = authUtils.verifyToken(token);
      
      // Get user from storage
      const user = await storageAdapter.findUserById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. User not found.',
          code: 'USER_NOT_FOUND'
        });
      }

      // Attach user info to request
      req.user = {
        ...decoded,
        profile: user
      };

      // Update last access time (for session management)
      req.user.lastAccess = new Date();

      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      
      let message = 'Access denied. Invalid token.';
      let code = 'INVALID_TOKEN';
      
      if (error.message === 'Token has expired') {
        message = 'Access denied. Token has expired.';
        code = 'TOKEN_EXPIRED';
      } else if (error.message === 'Invalid token') {
        message = 'Access denied. Malformed token.';
        code = 'MALFORMED_TOKEN';
      }

      return res.status(401).json({
        success: false,
        message,
        code
      });
    }
  }

  /**
   * Optional authentication (for public endpoints that can benefit from user context)
   */
  static async optionalAuth(req, res, next) {
    try {
      const token = AuthMiddleware.extractToken(req);
      
      if (token) {
        const decoded = authUtils.verifyToken(token);
        const user = await storageAdapter.findUserById(decoded.userId);
        
        if (user) {
          req.user = {
            ...decoded,
            profile: user
          };
        }
      }
      
      next();
    } catch (error) {
      // Silently fail for optional auth
      next();
    }
  }

  /**
   * Role-based authorization
   */
  static authorize(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Authentication required.',
          code: 'AUTH_REQUIRED'
        });
      }

      const userRole = req.user.role || 'user';
      
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: roles,
          current: userRole
        });
      }

      next();
    };
  }

  /**
   * Resource ownership check
   */
  static checkOwnership(resourceUserField = 'user') {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required.',
            code: 'AUTH_REQUIRED'
          });
        }

        // Admin can access all resources
        if (req.user.role === 'admin') {
          return next();
        }

        // For other users, check ownership
        const resourceId = req.params.id;
        
        if (!resourceId) {
          return res.status(400).json({
            success: false,
            message: 'Resource ID required.',
            code: 'RESOURCE_ID_REQUIRED'
          });
        }

        // This will be implemented by specific route handlers
        req.checkOwnership = {
          userId: req.user.userId,
          resourceId,
          resourceUserField
        };

        next();
      } catch (error) {
        console.error('Ownership check error:', error);
        return res.status(500).json({
          success: false,
          message: 'Error checking resource ownership.',
          code: 'OWNERSHIP_CHECK_ERROR'
        });
      }
    };
  }

  /**
   * Rate limiting per user
   */
  static userRateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    const userRequests = new Map();

    return (req, res, next) => {
      const userId = req.user?.userId || req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean old entries
      for (const [key, requests] of userRequests.entries()) {
        userRequests.set(key, requests.filter(time => time > windowStart));
        if (userRequests.get(key).length === 0) {
          userRequests.delete(key);
        }
      }

      // Check current user's requests
      const userRequestTimes = userRequests.get(userId) || [];
      const recentRequests = userRequestTimes.filter(time => time > windowStart);

      if (recentRequests.length >= maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      // Record this request
      recentRequests.push(now);
      userRequests.set(userId, recentRequests);

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': maxRequests - recentRequests.length,
        'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
      });

      next();
    };
  }

  /**
   * Validation error handler
   */
  static handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: formattedErrors
      });
    }

    next();
  }

  /**
   * Extract token from request
   */
  static extractToken(req) {
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check query parameter (for WebSocket or special cases)
    if (req.query.token) {
      return req.query.token;
    }

    // Check cookies (for web applications)
    if (req.cookies && req.cookies.authToken) {
      return req.cookies.authToken;
    }

    return null;
  }

  /**
   * Security headers middleware
   */
  static securityHeaders(req, res, next) {
    // Remove sensitive headers
    res.removeHeader('X-Powered-By');
    
    // Add security headers
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    });

    next();
  }

  /**
   * Request logging middleware
   */
  static requestLogger(req, res, next) {
    const start = Date.now();
    const userId = req.user?.userId || 'anonymous';
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - User: ${userId}`);
    });

    next();
  }
}

module.exports = AuthMiddleware;
