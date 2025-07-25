/**
 * Smart Applications Routes
 * Provides comprehensive application management with advanced features
 */

const express = require('express');
const ValidationUtils = require('../utils/validation');
const AuthMiddleware = require('../middleware/auth');
const storageAdapter = require('../storage/StorageAdapter');

const router = express.Router();

/**
 * @route   POST /api/applications
 * @desc    Submit a new application
 * @access  Private
 */
router.post('/',
  AuthMiddleware.authenticate,
  ValidationUtils.applicationSubmission(),
  AuthMiddleware.handleValidationErrors,
  AuthMiddleware.userRateLimit(10, 60 * 60 * 1000), // 10 applications per hour
  async (req, res) => {
    try {
      const {
        program,
        motivation,
        experience,
        goals,
        availability,
        technicalSkills,
        projects
      } = req.body;

      // Check if user already has an application for this program
      const existingApplication = await storageAdapter.findApplicationByUserAndProgram(
        req.user.userId,
        program
      );

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted an application for this program',
          code: 'DUPLICATE_APPLICATION',
          data: {
            existingApplication: {
              id: existingApplication._id || existingApplication.id,
              program: existingApplication.program,
              status: existingApplication.status,
              submissionDate: existingApplication.submissionDate
            }
          }
        });
      }

      // Validate technical skills format
      const validatedSkills = technicalSkills.map(skill => ({
        skill: skill.skill.trim(),
        level: skill.level,
        addedAt: new Date()
      }));

      // Validate and sanitize projects
      const validatedProjects = (projects || []).map(project => ({
        name: project.name?.trim(),
        description: project.description?.trim(),
        technologies: Array.isArray(project.technologies) 
          ? project.technologies.map(tech => tech.trim()).filter(Boolean)
          : [],
        url: project.url?.trim(),
        githubUrl: project.githubUrl?.trim(),
        addedAt: new Date()
      }));

      // Create application data
      const applicationData = {
        user: req.user.userId,
        program,
        motivation: motivation.trim(),
        experience: experience.trim(),
        goals: goals.trim(),
        availability: {
          startDate: new Date(availability.startDate),
          timeCommitment: availability.timeCommitment
        },
        technicalSkills: validatedSkills,
        projects: validatedProjects,
        metadata: {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
          submissionSource: 'web'
        }
      };

      // Create application
      const application = await storageAdapter.createApplication(applicationData);

      // Generate application reference number
      const referenceNumber = `MM-${new Date().getFullYear()}-${String(application._id || application.id).padStart(6, '0')}`;

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: {
          application: {
            ...application,
            referenceNumber
          }
        },
        meta: {
          storageMode: storageAdapter.getStorageStats().mode,
          submissionTime: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Application submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Error submitting application',
        code: 'SUBMISSION_ERROR'
      });
    }
  }
);

/**
 * @route   GET /api/applications
 * @desc    Get user's applications with pagination and filtering
 * @access  Private
 */
router.get('/',
  AuthMiddleware.authenticate,
  ValidationUtils.paginationQuery(),
  AuthMiddleware.handleValidationErrors,
  async (req, res) => {
    try {
      const { page = 1, limit = 10, sort = '-submissionDate', status, program } = req.query;

      // Get applications
      let applications = await storageAdapter.findApplicationsByUser(req.user.userId);

      // Apply filters
      if (status) {
        applications = applications.filter(app => app.status === status);
      }
      
      if (program) {
        applications = applications.filter(app => app.program === program);
      }

      // Apply sorting
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      
      applications.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue < bValue) return -1 * sortOrder;
        if (aValue > bValue) return 1 * sortOrder;
        return 0;
      });

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedApplications = applications.slice(startIndex, endIndex);

      // Add reference numbers
      const applicationsWithRef = paginatedApplications.map(app => ({
        ...app,
        referenceNumber: `MM-${new Date(app.submissionDate).getFullYear()}-${String(app._id || app.id).padStart(6, '0')}`
      }));

      res.json({
        success: true,
        data: {
          applications: applicationsWithRef,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(applications.length / limit),
            totalItems: applications.length,
            itemsPerPage: parseInt(limit),
            hasNextPage: endIndex < applications.length,
            hasPrevPage: page > 1
          },
          filters: {
            status,
            program,
            sort
          }
        },
        meta: {
          storageMode: storageAdapter.getStorageStats().mode
        }
      });

    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving applications',
        code: 'RETRIEVAL_ERROR'
      });
    }
  }
);

/**
 * @route   GET /api/applications/:id
 * @desc    Get specific application by ID
 * @access  Private
 */
router.get('/:id',
  AuthMiddleware.authenticate,
  ValidationUtils.mongoId(),
  AuthMiddleware.handleValidationErrors,
  AuthMiddleware.checkOwnership(),
  async (req, res) => {
    try {
      const application = await storageAdapter.findApplicationById(
        req.params.id,
        req.user.userId
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        });
      }

      // Add reference number and additional metadata
      const applicationWithMeta = {
        ...application,
        referenceNumber: `MM-${new Date(application.submissionDate).getFullYear()}-${String(application._id || application.id).padStart(6, '0')}`,
        analytics: {
          daysSubmitted: Math.floor((new Date() - new Date(application.submissionDate)) / (1000 * 60 * 60 * 24)),
          lastUpdated: application.lastUpdated || application.submissionDate,
          canEdit: application.status === 'pending',
          canWithdraw: ['pending', 'under_review'].includes(application.status)
        }
      };

      res.json({
        success: true,
        data: {
          application: applicationWithMeta
        }
      });

    } catch (error) {
      console.error('Get application error:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving application',
        code: 'RETRIEVAL_ERROR'
      });
    }
  }
);

/**
 * @route   PUT /api/applications/:id
 * @desc    Update application (only if status is pending)
 * @access  Private
 */
router.put('/:id',
  AuthMiddleware.authenticate,
  ValidationUtils.mongoId(),
  AuthMiddleware.handleValidationErrors,
  AuthMiddleware.checkOwnership(),
  async (req, res) => {
    try {
      const application = await storageAdapter.findApplicationById(
        req.params.id,
        req.user.userId
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        });
      }

      // Check if application can be updated
      if (application.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Cannot update application that is no longer pending',
          code: 'APPLICATION_NOT_EDITABLE',
          data: {
            currentStatus: application.status,
            allowedStatuses: ['pending']
          }
        });
      }

      // Validate update data
      const allowedFields = ['motivation', 'experience', 'goals', 'technicalSkills', 'projects'];
      const updateData = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update',
          code: 'NO_UPDATE_DATA',
          data: {
            allowedFields
          }
        });
      }

      // Update application
      const updatedApplication = await storageAdapter.updateApplication(
        req.params.id,
        req.user.userId,
        updateData
      );

      res.json({
        success: true,
        message: 'Application updated successfully',
        data: {
          application: {
            ...updatedApplication,
            referenceNumber: `MM-${new Date(updatedApplication.submissionDate).getFullYear()}-${String(updatedApplication._id || updatedApplication.id).padStart(6, '0')}`
          }
        }
      });

    } catch (error) {
      console.error('Update application error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating application',
        code: 'UPDATE_ERROR'
      });
    }
  }
);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete/withdraw application (only if status is pending)
 * @access  Private
 */
router.delete('/:id',
  AuthMiddleware.authenticate,
  ValidationUtils.mongoId(),
  AuthMiddleware.handleValidationErrors,
  AuthMiddleware.checkOwnership(),
  async (req, res) => {
    try {
      const application = await storageAdapter.findApplicationById(
        req.params.id,
        req.user.userId
      );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        });
      }

      // Check if application can be deleted
      if (!['pending', 'under_review'].includes(application.status)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot withdraw application with current status',
          code: 'APPLICATION_NOT_WITHDRAWABLE',
          data: {
            currentStatus: application.status,
            allowedStatuses: ['pending', 'under_review']
          }
        });
      }

      // Delete application
      await storageAdapter.deleteApplication(req.params.id, req.user.userId);

      res.json({
        success: true,
        message: 'Application withdrawn successfully',
        data: {
          withdrawnApplication: {
            id: application._id || application.id,
            program: application.program,
            referenceNumber: `MM-${new Date(application.submissionDate).getFullYear()}-${String(application._id || application.id).padStart(6, '0')}`,
            withdrawnAt: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      console.error('Delete application error:', error);
      res.status(500).json({
        success: false,
        message: 'Error withdrawing application',
        code: 'WITHDRAWAL_ERROR'
      });
    }
  }
);

module.exports = router;
