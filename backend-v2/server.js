/**
 * MasterMinds Backend Server v2.0
 * Smart, Production-Ready Express Server with Advanced Features
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Import utilities and middleware
const storageAdapter = require('./src/storage/StorageAdapter');
const AuthMiddleware = require('./src/middleware/auth');

// Import routes
const authRoutes = require('./src/routes/auth');
const applicationRoutes = require('./src/routes/applications');

// Initialize Express app
const app = express();

// Environment variables with defaults
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_VERSION = process.env.API_VERSION || 'v1';

/**
 * Security Middleware
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

/**
 * Rate Limiting
 */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

/**
 * CORS Configuration
 */
const frontendUrls = process.env.FRONTEND_URLS 
  ? process.env.FRONTEND_URLS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (frontendUrls.indexOf(origin) !== -1 || NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

/**
 * General Middleware
 */
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Security headers and request logging
app.use(AuthMiddleware.securityHeaders);
app.use(AuthMiddleware.requestLogger);

/**
 * MongoDB Connection with Smart Fallback
 */
async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/masterminds';
    const connectionTimeout = parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000;

    console.log('🔄 Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: connectionTimeout,
      socketTimeoutMS: connectionTimeout,
    });

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    storageAdapter.setMongoStatus(true);

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB Connection Error:', error.message);
      storageAdapter.setMongoStatus(false);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB Disconnected');
      storageAdapter.setMongoStatus(false);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB Reconnected');
      storageAdapter.setMongoStatus(true);
    });

  } catch (error) {
    console.log('⚠️  MongoDB Connection Failed:', error.message);
    console.log('🔄 Falling back to In-Memory Storage');
    console.log('💡 To use MongoDB, ensure it\'s running and check your connection string');
    storageAdapter.setMongoStatus(false);
  }
}

/**
 * API Routes
 */
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/applications`, applicationRoutes);

// Legacy routes (for backward compatibility)
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

/**
 * Health Check Endpoint
 */
app.get('/api/health', (req, res) => {
  const storageStats = storageAdapter.getStorageStats();
  
  res.json({
    success: true,
    message: 'MasterMinds Backend Server is running!',
    data: {
      status: 'healthy',
      version: '2.0.0',
      environment: NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      storage: storageStats,
      features: {
        authentication: 'enabled',
        rateLimit: 'enabled',
        security: 'enabled',
        cors: 'enabled',
        compression: 'enabled'
      }
    }
  });
});

/**
 * API Documentation Endpoint
 */
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'MasterMinds API Documentation',
    data: {
      version: '2.0.0',
      baseUrl: `${req.protocol}://${req.get('host')}/api/${API_VERSION}`,
      endpoints: {
        authentication: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
          me: 'GET /auth/me',
          logout: 'POST /auth/logout',
          refresh: 'POST /auth/refresh'
        },
        applications: {
          create: 'POST /applications',
          list: 'GET /applications',
          get: 'GET /applications/:id',
          update: 'PUT /applications/:id',
          delete: 'DELETE /applications/:id'
        },
        system: {
          health: 'GET /health',
          docs: 'GET /docs'
        }
      },
      authentication: {
        type: 'Bearer Token',
        header: 'Authorization: Bearer <token>'
      }
    }
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    code: 'ENDPOINT_NOT_FOUND',
    data: {
      method: req.method,
      path: req.path,
      suggestion: 'Check the API documentation at /api/docs'
    }
  });
});

/**
 * Global Error Handler
 */
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);

  // CORS errors
  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      code: 'CORS_ERROR'
    });
  }

  // JSON parsing errors
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
      code: 'INVALID_JSON'
    });
  }

  // Default error response
  res.status(error.status || 500).json({
    success: false,
    message: NODE_ENV === 'development' ? error.message : 'Internal server error',
    code: 'INTERNAL_ERROR',
    ...(NODE_ENV === 'development' && { stack: error.stack })
  });
});

/**
 * Graceful Shutdown
 */
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  }
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  }
  
  process.exit(0);
});

/**
 * Start Server
 */
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log('🚀 MasterMinds Backend Server v2.0 Started');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
      console.log(`🔒 Security: Enabled (Helmet, CORS, Rate Limiting)`);
      console.log('✨ Ready to accept connections!');
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
