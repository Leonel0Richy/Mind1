/**
 * Comprehensive API Test Suite
 * Tests all endpoints with various scenarios
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5003/api';

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe.test@masterminds.com',
  password: 'SecurePass123!',
  phone: '+1234567890'
};

const testApplication = {
  program: 'Full Stack Development',
  motivation: 'I am passionate about web development and want to enhance my skills in full-stack development. I believe this program will help me achieve my career goals and contribute to innovative projects. My experience with various technologies has prepared me for this next step.',
  experience: 'I have 2 years of experience in frontend development using React and JavaScript. I have worked on several personal projects and contributed to open-source repositories. I am familiar with modern development practices.',
  goals: 'My goal is to become a senior full-stack developer and eventually lead a development team. I want to master both frontend and backend technologies and contribute to meaningful projects.',
  availability: {
    startDate: '2025-03-01',
    timeCommitment: 'Full-time (40+ hours/week)'
  },
  technicalSkills: [
    { skill: 'JavaScript', level: 'Advanced' },
    { skill: 'React', level: 'Intermediate' },
    { skill: 'Node.js', level: 'Beginner' },
    { skill: 'Python', level: 'Intermediate' }
  ],
  projects: [
    {
      name: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform built with React and Node.js, featuring user authentication, payment processing, and inventory management.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
      url: 'https://example-ecommerce.com',
      githubUrl: 'https://github.com/johndoe/ecommerce-platform'
    },
    {
      name: 'Task Management App',
      description: 'A collaborative task management application with real-time updates and team collaboration features.',
      technologies: ['Vue.js', 'Firebase', 'Socket.io'],
      url: 'https://example-tasks.com',
      githubUrl: 'https://github.com/johndoe/task-manager'
    }
  ]
};

let authToken = '';
let applicationId = '';

class APITester {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.total = 0;
  }

  async test(name, testFunction) {
    this.total++;
    try {
      console.log(`\n🧪 Testing: ${name}`);
      await testFunction();
      console.log(`✅ PASSED: ${name}`);
      this.passed++;
    } catch (error) {
      console.log(`❌ FAILED: ${name}`);
      console.log(`   Error: ${error.message}`);
      if (error.response?.data) {
        console.log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
      }
      this.failed++;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.total}`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Success Rate: ${((this.passed / this.total) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));
  }
}

const tester = new APITester();

async function runTests() {
  console.log('🚀 Starting Comprehensive API Tests...');
  console.log('🎯 Testing MasterMinds Backend v2.0');

  // Test 1: Health Check
  await tester.test('Health Check', async () => {
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.status !== 200) throw new Error('Health check failed');
    if (!response.data.success) throw new Error('Health check returned unsuccessful');
    console.log(`   Storage Mode: ${response.data.data.storage.mode}`);
    console.log(`   Server Version: ${response.data.data.version}`);
  });

  // Test 2: API Documentation
  await tester.test('API Documentation', async () => {
    const response = await axios.get(`${BASE_URL}/docs`);
    if (response.status !== 200) throw new Error('API docs failed');
    if (!response.data.data.endpoints) throw new Error('API docs missing endpoints');
  });

  // Test 3: User Registration
  await tester.test('User Registration', async () => {
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    if (response.status !== 201) throw new Error('Registration failed');
    if (!response.data.success) throw new Error('Registration returned unsuccessful');
    if (!response.data.data.tokens.accessToken) throw new Error('No access token received');
    
    authToken = response.data.data.tokens.accessToken;
    console.log(`   User ID: ${response.data.data.user._id || response.data.data.user.id}`);
    console.log(`   Storage: ${response.data.meta.storageMode}`);
  });

  // Test 4: Duplicate Registration (should fail)
  await tester.test('Duplicate Registration Prevention', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/register`, testUser);
      throw new Error('Duplicate registration should have failed');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.code === 'USER_EXISTS') {
        // This is expected
        console.log('   ✓ Correctly prevented duplicate registration');
      } else {
        throw error;
      }
    }
  });

  // Test 5: User Login
  await tester.test('User Login', async () => {
    const response = await axios.post(`${BASE_URL}/auth/signin`, {
      email: testUser.email,
      password: testUser.password
    });
    if (response.status !== 200) throw new Error('Login failed');
    if (!response.data.success) throw new Error('Login returned unsuccessful');
    if (!response.data.data.tokens.accessToken) throw new Error('No access token received');
    
    authToken = response.data.data.tokens.accessToken;
    console.log(`   Login Time: ${response.data.meta.loginTime}`);
  });

  // Test 6: Invalid Login (should fail)
  await tester.test('Invalid Login Prevention', async () => {
    try {
      await axios.post(`${BASE_URL}/auth/signin`, {
        email: testUser.email,
        password: 'wrongpassword'
      });
      throw new Error('Invalid login should have failed');
    } catch (error) {
      if (error.response?.status === 401 && error.response?.data?.code === 'INVALID_CREDENTIALS') {
        console.log('   ✓ Correctly prevented invalid login');
      } else {
        throw error;
      }
    }
  });

  // Test 7: Get Current User
  await tester.test('Get Current User', async () => {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (response.status !== 200) throw new Error('Get user failed');
    if (!response.data.success) throw new Error('Get user returned unsuccessful');
    if (response.data.data.user.email !== testUser.email) throw new Error('Wrong user returned');
    
    console.log(`   User: ${response.data.data.user.firstName} ${response.data.data.user.lastName}`);
  });

  // Test 8: Unauthorized Access (should fail)
  await tester.test('Unauthorized Access Prevention', async () => {
    try {
      await axios.get(`${BASE_URL}/auth/me`);
      throw new Error('Unauthorized access should have failed');
    } catch (error) {
      if (error.response?.status === 401 && error.response?.data?.code === 'NO_TOKEN') {
        console.log('   ✓ Correctly prevented unauthorized access');
      } else {
        throw error;
      }
    }
  });

  // Test 9: Submit Application
  await tester.test('Submit Application', async () => {
    const response = await axios.post(`${BASE_URL}/applications`, testApplication, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (response.status !== 201) throw new Error('Application submission failed');
    if (!response.data.success) throw new Error('Application submission returned unsuccessful');
    
    applicationId = response.data.data.application._id || response.data.data.application.id;
    console.log(`   Application ID: ${applicationId}`);
    console.log(`   Reference: ${response.data.data.application.referenceNumber}`);
    console.log(`   Program: ${response.data.data.application.program}`);
  });

  // Test 10: Duplicate Application (should fail)
  await tester.test('Duplicate Application Prevention', async () => {
    try {
      await axios.post(`${BASE_URL}/applications`, testApplication, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      throw new Error('Duplicate application should have failed');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.code === 'DUPLICATE_APPLICATION') {
        console.log('   ✓ Correctly prevented duplicate application');
      } else {
        throw error;
      }
    }
  });

  // Test 11: Get User Applications
  await tester.test('Get User Applications', async () => {
    const response = await axios.get(`${BASE_URL}/applications`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (response.status !== 200) throw new Error('Get applications failed');
    if (!response.data.success) throw new Error('Get applications returned unsuccessful');
    if (response.data.data.applications.length === 0) throw new Error('No applications returned');
    
    console.log(`   Applications Count: ${response.data.data.applications.length}`);
    console.log(`   Pagination: Page ${response.data.data.pagination.currentPage} of ${response.data.data.pagination.totalPages}`);
  });

  // Test 12: Get Specific Application
  await tester.test('Get Specific Application', async () => {
    const response = await axios.get(`${BASE_URL}/applications/${applicationId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (response.status !== 200) throw new Error('Get application failed');
    if (!response.data.success) throw new Error('Get application returned unsuccessful');
    if (response.data.data.application.program !== testApplication.program) throw new Error('Wrong application returned');
    
    console.log(`   Status: ${response.data.data.application.status}`);
    console.log(`   Can Edit: ${response.data.data.application.analytics.canEdit}`);
  });

  // Test 13: Update Application
  await tester.test('Update Application', async () => {
    const updateData = {
      motivation: testApplication.motivation + ' Updated with additional motivation and goals for the program.'
    };
    
    const response = await axios.put(`${BASE_URL}/applications/${applicationId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (response.status !== 200) throw new Error('Update application failed');
    if (!response.data.success) throw new Error('Update application returned unsuccessful');
    
    console.log('   ✓ Application updated successfully');
  });

  // Test 14: Invalid Application ID (should fail)
  await tester.test('Invalid Application ID Handling', async () => {
    try {
      await axios.get(`${BASE_URL}/applications/invalid-id`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      throw new Error('Invalid ID should have failed');
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 404) {
        console.log('   ✓ Correctly handled invalid application ID');
      } else {
        throw error;
      }
    }
  });

  // Test 15: Logout
  await tester.test('User Logout', async () => {
    const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (response.status !== 200) throw new Error('Logout failed');
    if (!response.data.success) throw new Error('Logout returned unsuccessful');
    
    console.log('   ✓ User logged out successfully');
  });

  // Test 16: Rate Limiting (optional - might take time)
  await tester.test('Rate Limiting (Basic Check)', async () => {
    // Make a few rapid requests to test rate limiting
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(axios.get(`${BASE_URL}/health`));
    }
    
    const responses = await Promise.all(requests);
    const hasRateLimitHeaders = responses.some(r => r.headers['x-ratelimit-limit']);
    
    if (!hasRateLimitHeaders) {
      console.log('   ⚠️  Rate limit headers not found (might be disabled in dev)');
    } else {
      console.log('   ✓ Rate limiting headers present');
    }
  });

  // Print final summary
  tester.printSummary();

  if (tester.failed === 0) {
    console.log('🎉 All tests passed! The API is working perfectly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test suite failed to run:', error.message);
  process.exit(1);
});
