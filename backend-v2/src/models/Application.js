const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  program: {
    type: String,
    required: [true, 'Program selection is required'],
    enum: [
      'Full Stack Development',
      'Data Science & Analytics',
      'AI & Machine Learning',
      'Mobile App Development',
      'Cloud Infrastructure',
      'Cybersecurity',
      'UI/UX Design',
      'DevOps Engineering'
    ]
  },
  motivation: {
    type: String,
    required: [true, 'Motivation letter is required'],
    minlength: [100, 'Motivation letter must be at least 100 characters'],
    maxlength: [2000, 'Motivation letter cannot exceed 2000 characters']
  },
  experience: {
    type: String,
    required: [true, 'Experience description is required'],
    minlength: [50, 'Experience description must be at least 50 characters'],
    maxlength: [1500, 'Experience description cannot exceed 1500 characters']
  },
  goals: {
    type: String,
    required: [true, 'Career goals are required'],
    minlength: [50, 'Career goals must be at least 50 characters'],
    maxlength: [1000, 'Career goals cannot exceed 1000 characters']
  },
  availability: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    timeCommitment: {
      type: String,
      required: [true, 'Time commitment is required'],
      enum: ['Part-time (10-20 hours/week)', 'Full-time (40+ hours/week)', 'Flexible']
    }
  },
  technicalSkills: [{
    skill: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: true
    }
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
    githubUrl: String
  }],
  resume: {
    filename: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'interview_scheduled', 'accepted', 'rejected', 'waitlisted'],
    default: 'pending'
  },
  reviewNotes: {
    type: String,
    maxlength: [1000, 'Review notes cannot exceed 1000 characters']
  },
  interviewDate: {
    type: Date
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  referenceNumber: {
    type: String,
    unique: true
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    submissionSource: {
      type: String,
      default: 'web'
    }
  }
}, {
  timestamps: true
});

// Generate reference number before saving
applicationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  
  // Generate reference number if not exists
  if (!this.referenceNumber) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.referenceNumber = `APP-${timestamp}-${random}`.toUpperCase();
  }
  
  next();
});

// Index for efficient queries
applicationSchema.index({ user: 1, program: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ submissionDate: -1 });
applicationSchema.index({ referenceNumber: 1 });

module.exports = mongoose.model('Application', applicationSchema);
