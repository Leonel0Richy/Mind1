/**
 * Smart Storage Adapter - Automatically switches between MongoDB and In-Memory storage
 * This provides a unified interface for data operations regardless of the storage backend
 */

class StorageAdapter {
  constructor() {
    this.isMongoConnected = false;
    this.inMemoryData = {
      users: new Map(),
      applications: new Map(),
      sessions: new Map()
    };
    this.counters = {
      users: 1,
      applications: 1,
      sessions: 1
    };
  }

  setMongoStatus(connected) {
    this.isMongoConnected = connected;
    console.log(`📊 Storage Mode: ${connected ? 'MongoDB' : 'In-Memory'}`);
  }

  // User Operations
  async createUser(userData) {
    if (this.isMongoConnected) {
      const User = require('../models/User');
      const user = new User(userData);
      await user.save();
      return user.toObject();
    } else {
      const user = {
        _id: this.counters.users++,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.inMemoryData.users.set(user._id, user);
      return user;
    }
  }

  async findUserByEmail(email) {
    if (this.isMongoConnected) {
      const User = require('../models/User');
      return await User.findOne({ email });
    } else {
      for (const user of this.inMemoryData.users.values()) {
        if (user.email === email) {
          return user;
        }
      }
      return null;
    }
  }

  async findUserById(id) {
    if (this.isMongoConnected) {
      const User = require('../models/User');
      return await User.findById(id).select('-password');
    } else {
      const user = this.inMemoryData.users.get(parseInt(id));
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    }
  }

  async updateUser(id, updateData) {
    if (this.isMongoConnected) {
      const User = require('../models/User');
      return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    } else {
      const user = this.inMemoryData.users.get(parseInt(id));
      if (user) {
        Object.assign(user, updateData, { updatedAt: new Date() });
        this.inMemoryData.users.set(parseInt(id), user);
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    }
  }

  // Application Operations
  async createApplication(applicationData) {
    if (this.isMongoConnected) {
      const Application = require('../models/Application');
      const application = new Application(applicationData);
      await application.save();
      return application.toObject();
    } else {
      const application = {
        _id: this.counters.applications++,
        ...applicationData,
        status: 'pending',
        submissionDate: new Date(),
        lastUpdated: new Date()
      };
      this.inMemoryData.applications.set(application._id, application);
      return application;
    }
  }

  async findApplicationsByUser(userId) {
    if (this.isMongoConnected) {
      const Application = require('../models/Application');
      return await Application.find({ user: userId })
        .populate('user', 'firstName lastName email')
        .sort({ submissionDate: -1 });
    } else {
      const applications = Array.from(this.inMemoryData.applications.values())
        .filter(app => app.user === userId)
        .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
      return applications;
    }
  }

  async findApplicationById(id, userId) {
    if (this.isMongoConnected) {
      const Application = require('../models/Application');
      return await Application.findOne({ _id: id, user: userId })
        .populate('user', 'firstName lastName email');
    } else {
      const application = this.inMemoryData.applications.get(parseInt(id));
      if (application && application.user === userId) {
        return application;
      }
      return null;
    }
  }

  async findApplicationByUserAndProgram(userId, program) {
    if (this.isMongoConnected) {
      const Application = require('../models/Application');
      return await Application.findOne({ user: userId, program });
    } else {
      for (const application of this.inMemoryData.applications.values()) {
        if (application.user === userId && application.program === program) {
          return application;
        }
      }
      return null;
    }
  }

  async updateApplication(id, userId, updateData) {
    if (this.isMongoConnected) {
      const Application = require('../models/Application');
      return await Application.findOneAndUpdate(
        { _id: id, user: userId },
        updateData,
        { new: true, runValidators: true }
      ).populate('user', 'firstName lastName email');
    } else {
      const application = this.inMemoryData.applications.get(parseInt(id));
      if (application && application.user === userId) {
        Object.assign(application, updateData, { lastUpdated: new Date() });
        this.inMemoryData.applications.set(parseInt(id), application);
        return application;
      }
      return null;
    }
  }

  async deleteApplication(id, userId) {
    if (this.isMongoConnected) {
      const Application = require('../models/Application');
      return await Application.findOneAndDelete({ _id: id, user: userId });
    } else {
      const application = this.inMemoryData.applications.get(parseInt(id));
      if (application && application.user === userId) {
        this.inMemoryData.applications.delete(parseInt(id));
        return application;
      }
      return null;
    }
  }

  // Session Management (for advanced auth features)
  async createSession(sessionData) {
    const session = {
      _id: this.counters.sessions++,
      ...sessionData,
      createdAt: new Date(),
      lastAccessed: new Date()
    };
    this.inMemoryData.sessions.set(session._id, session);
    return session;
  }

  async findSessionByToken(token) {
    for (const session of this.inMemoryData.sessions.values()) {
      if (session.token === token) {
        return session;
      }
    }
    return null;
  }

  async deleteSession(sessionId) {
    return this.inMemoryData.sessions.delete(sessionId);
  }

  // Utility Methods
  getStorageStats() {
    if (this.isMongoConnected) {
      return { mode: 'MongoDB', status: 'Connected' };
    } else {
      return {
        mode: 'In-Memory',
        status: 'Active',
        data: {
          users: this.inMemoryData.users.size,
          applications: this.inMemoryData.applications.size,
          sessions: this.inMemoryData.sessions.size
        }
      };
    }
  }

  clearInMemoryData() {
    this.inMemoryData.users.clear();
    this.inMemoryData.applications.clear();
    this.inMemoryData.sessions.clear();
    this.counters = { users: 1, applications: 1, sessions: 1 };
  }
}

// Singleton instance
const storageAdapter = new StorageAdapter();

module.exports = storageAdapter;
