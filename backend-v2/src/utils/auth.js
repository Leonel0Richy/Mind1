/**
 * Smart Authentication Utilities
 * Provides secure, production-ready authentication features
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthUtils {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
    this.BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.loginAttempts = new Map(); // Track failed login attempts
  }

  /**
   * Hash password with bcrypt
   */
  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(this.BCRYPT_ROUNDS);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error('Password hashing failed');
    }
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('Password comparison failed');
    }
  }

  /**
   * Generate JWT token with enhanced security
   */
  generateToken(payload, options = {}) {
    try {
      const tokenPayload = {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        jti: crypto.randomUUID() // Unique token ID for revocation
      };

      const tokenOptions = {
        expiresIn: options.expiresIn || this.JWT_EXPIRES_IN,
        issuer: 'masterminds-api',
        audience: 'masterminds-app',
        ...options
      };

      return jwt.sign(tokenPayload, this.JWT_SECRET, tokenOptions);
    } catch (error) {
      throw new Error('Token generation failed');
    }
  }

  /**
   * Verify JWT token with enhanced validation
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET, {
        issuer: 'masterminds-api',
        audience: 'masterminds-app'
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Generate secure refresh token
   */
  generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Rate limiting for login attempts
   */
  checkLoginAttempts(identifier) {
    const attempts = this.loginAttempts.get(identifier);
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
    const lockTime = parseInt(process.env.ACCOUNT_LOCK_TIME) || 30 * 60 * 1000; // 30 minutes

    if (!attempts) {
      return { allowed: true, remaining: maxAttempts };
    }

    // Check if account is locked
    if (attempts.lockedUntil && attempts.lockedUntil > Date.now()) {
      const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
      return { 
        allowed: false, 
        locked: true, 
        remainingTime: `${remainingTime} minutes` 
      };
    }

    // Reset if lock time has passed
    if (attempts.lockedUntil && attempts.lockedUntil <= Date.now()) {
      this.loginAttempts.delete(identifier);
      return { allowed: true, remaining: maxAttempts };
    }

    // Check remaining attempts
    const remaining = maxAttempts - attempts.count;
    if (remaining <= 0) {
      // Lock the account
      attempts.lockedUntil = Date.now() + lockTime;
      this.loginAttempts.set(identifier, attempts);
      return { 
        allowed: false, 
        locked: true, 
        remainingTime: `${lockTime / 1000 / 60} minutes` 
      };
    }

    return { allowed: true, remaining };
  }

  /**
   * Record failed login attempt
   */
  recordFailedLogin(identifier) {
    const attempts = this.loginAttempts.get(identifier) || { count: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(identifier, attempts);
  }

  /**
   * Clear login attempts on successful login
   */
  clearLoginAttempts(identifier) {
    this.loginAttempts.delete(identifier);
  }

  /**
   * Generate secure API key
   */
  generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  /**
   * Calculate password strength score
   */
  calculatePasswordStrength(password) {
    let score = 0;
    
    // Length bonus
    score += Math.min(password.length * 2, 20);
    
    // Character variety bonus
    if (/[a-z]/.test(password)) score += 5;
    if (/[A-Z]/.test(password)) score += 5;
    if (/\d/.test(password)) score += 5;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
    
    // Pattern penalties
    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 10; // Common patterns

    const strength = Math.max(0, Math.min(100, score));
    
    if (strength >= 80) return 'Very Strong';
    if (strength >= 60) return 'Strong';
    if (strength >= 40) return 'Medium';
    if (strength >= 20) return 'Weak';
    return 'Very Weak';
  }

  /**
   * Generate secure session ID
   */
  generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Sanitize user data for JWT payload
   */
  sanitizeUserForToken(user) {
    return {
      userId: user._id || user.id,
      email: user.email,
      role: user.role || 'user',
      firstName: user.firstName,
      lastName: user.lastName
    };
  }
}

// Singleton instance
const authUtils = new AuthUtils();

module.exports = authUtils;
