/**
 * Smart Validation Utilities
 * Provides comprehensive validation for all data types
 */

const { body, param, query } = require('express-validator');

class ValidationUtils {
  /**
   * User validation rules
   */
  static userRegistration() {
    return [
      body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),
      
      body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),
      
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address')
        .isLength({ max: 255 })
        .withMessage('Email address is too long'),
      
      body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
      
      body('phone')
        .optional()
        .matches(/^\+?[\d\s\-\(\)]+$/)
        .withMessage('Please enter a valid phone number')
        .isLength({ max: 20 })
        .withMessage('Phone number is too long'),
      
      body('dateOfBirth')
        .optional()
        .isISO8601()
        .withMessage('Please enter a valid date of birth')
        .custom((value) => {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 13 || age > 120) {
            throw new Error('Age must be between 13 and 120 years');
          }
          return true;
        })
    ];
  }

  static userLogin() {
    return [
      body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address'),
      
      body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ max: 128 })
        .withMessage('Password is too long')
    ];
  }

  /**
   * Application validation rules
   */
  static applicationSubmission() {
    const validPrograms = [
      'Full Stack Development',
      'Data Science & Analytics',
      'AI & Machine Learning',
      'Mobile App Development',
      'Cloud Infrastructure',
      'Cybersecurity',
      'UI/UX Design',
      'DevOps Engineering'
    ];

    const validTimeCommitments = [
      'Part-time (10-20 hours/week)',
      'Full-time (40+ hours/week)',
      'Flexible'
    ];

    const validSkillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    return [
      body('program')
        .isIn(validPrograms)
        .withMessage(`Program must be one of: ${validPrograms.join(', ')}`),
      
      body('motivation')
        .trim()
        .isLength({ min: 100, max: 2000 })
        .withMessage('Motivation letter must be between 100 and 2000 characters')
        .matches(/^[a-zA-Z0-9\s.,!?;:'"()\-]+$/)
        .withMessage('Motivation letter contains invalid characters'),
      
      body('experience')
        .trim()
        .isLength({ min: 50, max: 1500 })
        .withMessage('Experience description must be between 50 and 1500 characters'),
      
      body('goals')
        .trim()
        .isLength({ min: 50, max: 1000 })
        .withMessage('Career goals must be between 50 and 1000 characters'),
      
      body('availability.startDate')
        .isISO8601()
        .withMessage('Please provide a valid start date')
        .custom((value) => {
          const startDate = new Date(value);
          const today = new Date();
          const maxDate = new Date();
          maxDate.setFullYear(today.getFullYear() + 2);
          
          if (startDate < today) {
            throw new Error('Start date cannot be in the past');
          }
          if (startDate > maxDate) {
            throw new Error('Start date cannot be more than 2 years in the future');
          }
          return true;
        }),
      
      body('availability.timeCommitment')
        .isIn(validTimeCommitments)
        .withMessage(`Time commitment must be one of: ${validTimeCommitments.join(', ')}`),
      
      body('technicalSkills')
        .isArray({ min: 1, max: 20 })
        .withMessage('Please provide 1-20 technical skills'),
      
      body('technicalSkills.*.skill')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Skill name must be between 2 and 50 characters'),
      
      body('technicalSkills.*.level')
        .isIn(validSkillLevels)
        .withMessage(`Skill level must be one of: ${validSkillLevels.join(', ')}`),
      
      body('projects')
        .optional()
        .isArray({ max: 10 })
        .withMessage('Maximum 10 projects allowed'),
      
      body('projects.*.name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Project name must be between 2 and 100 characters'),
      
      body('projects.*.description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Project description must be between 10 and 500 characters'),
      
      body('projects.*.url')
        .optional()
        .isURL()
        .withMessage('Please provide a valid project URL'),
      
      body('projects.*.githubUrl')
        .optional()
        .isURL()
        .withMessage('Please provide a valid GitHub URL')
        .custom((value) => {
          if (value && !value.includes('github.com')) {
            throw new Error('GitHub URL must be from github.com');
          }
          return true;
        })
    ];
  }

  /**
   * Parameter validation
   */
  static mongoId(paramName = 'id') {
    return param(paramName)
      .matches(/^[0-9a-fA-F]{24}$|^[0-9]+$/)
      .withMessage('Invalid ID format');
  }

  /**
   * Query validation
   */
  static paginationQuery() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Page must be a number between 1 and 1000'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be a number between 1 and 100'),
      
      query('sort')
        .optional()
        .isIn(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'name', '-name'])
        .withMessage('Invalid sort parameter')
    ];
  }

  /**
   * File upload validation
   */
  static fileUpload() {
    return [
      body('fileType')
        .optional()
        .isIn(['image', 'document', 'resume'])
        .withMessage('Invalid file type'),
      
      body('fileName')
        .optional()
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('File name must be between 1 and 255 characters')
        .matches(/^[a-zA-Z0-9._\-\s]+$/)
        .withMessage('File name contains invalid characters')
    ];
  }

  /**
   * Custom validation helpers
   */
  static sanitizeHtml(value) {
    // Basic HTML sanitization
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  static validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static validatePhoneNumber(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,20}$/;
    return phoneRegex.test(phone);
  }

  static validateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
  }

  /**
   * Security validation
   */
  static preventSqlInjection(value) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(--|\/\*|\*\/|;|'|"|`)/g
    ];
    
    return !sqlPatterns.some(pattern => pattern.test(value));
  }

  static preventXSS(value) {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi
    ];
    
    return !xssPatterns.some(pattern => pattern.test(value));
  }
}

module.exports = ValidationUtils;
