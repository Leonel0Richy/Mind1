const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const User = require('../models/User');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// In-memory storage for demo purposes when MongoDB is not available
let inMemoryApplications = [];
let applicationIdCounter = 1;

// @route   POST /api/applications
// @desc    Submit a new application
// @access  Private
router.post('/', auth, [
  body('program')
    .isIn([
      'Full Stack Development',
      'Data Science & Analytics',
      'AI & Machine Learning',
      'Mobile App Development',
      'Cloud Infrastructure',
      'Cybersecurity',
      'UI/UX Design',
      'DevOps Engineering'
    ])
    .withMessage('Please select a valid program'),
  body('motivation')
    .isLength({ min: 100, max: 2000 })
    .withMessage('Motivation letter must be between 100 and 2000 characters'),
  body('experience')
    .isLength({ min: 50, max: 1500 })
    .withMessage('Experience description must be between 50 and 1500 characters'),
  body('goals')
    .isLength({ min: 50, max: 1000 })
    .withMessage('Career goals must be between 50 and 1000 characters'),
  body('availability.startDate')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('availability.timeCommitment')
    .isIn(['Part-time (10-20 hours/week)', 'Full-time (40+ hours/week)', 'Flexible'])
    .withMessage('Please select a valid time commitment'),
  body('technicalSkills')
    .isArray({ min: 1 })
    .withMessage('Please provide at least one technical skill')
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

    const {
      program,
      motivation,
      experience,
      goals,
      availability,
      technicalSkills,
      projects
    } = req.body;

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      // Use MongoDB
      const existingApplication = await Application.findOne({
        user: req.user.userId,
        program: program
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted an application for this program'
        });
      }

      const application = new Application({
        user: req.user.userId,
        program,
        motivation,
        experience,
        goals,
        availability,
        technicalSkills,
        projects: projects || []
      });

      await application.save();

      await User.findByIdAndUpdate(
        req.user.userId,
        { $push: { applications: application._id } }
      );

      await application.populate('user', 'firstName lastName email');

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        application
      });
    } else {
      // Use in-memory storage for demo
      const existingApplication = inMemoryApplications.find(
        app => app.user === req.user.userId && app.program === program
      );

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted an application for this program'
        });
      }

      const application = {
        id: applicationIdCounter++,
        user: req.user.userId,
        program,
        motivation,
        experience,
        goals,
        availability,
        technicalSkills,
        projects: projects || [],
        status: 'pending',
        submissionDate: new Date(),
        lastUpdated: new Date()
      };

      inMemoryApplications.push(application);

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully (demo mode)',
        application
      });
    }

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during application submission'
    });
  }
});

// @route   GET /api/applications
// @desc    Get user's applications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const applications = await Application.find({ user: req.user.userId })
        .populate('user', 'firstName lastName email')
        .sort({ submissionDate: -1 });

      res.json({
        success: true,
        applications
      });
    } else {
      // Use in-memory storage for demo
      const applications = inMemoryApplications
        .filter(app => app.user === req.user.userId)
        .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));

      res.json({
        success: true,
        applications
      });
    }

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications'
    });
  }
});

// @route   GET /api/applications/:id
// @desc    Get specific application
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('user', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application'
    });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application (only if status is pending)
// @access  Private
router.put('/:id', auth, [
  body('motivation')
    .optional()
    .isLength({ min: 100, max: 2000 })
    .withMessage('Motivation letter must be between 100 and 2000 characters'),
  body('experience')
    .optional()
    .isLength({ min: 50, max: 1500 })
    .withMessage('Experience description must be between 50 and 1500 characters'),
  body('goals')
    .optional()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Career goals must be between 50 and 1000 characters')
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

    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Only allow updates if application is still pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update application that is no longer pending'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['motivation', 'experience', 'goals', 'technicalSkills', 'projects'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Application updated successfully',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating application'
    });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete application (only if status is pending)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Only allow deletion if application is still pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete application that is no longer pending'
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    // Remove application from user's applications array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { applications: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting application'
    });
  }
});

module.exports = router;
