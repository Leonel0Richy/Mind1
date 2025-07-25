const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@test.com',
  password: 'Test123456',
  phone: '+1234567890'
};

const testApplication = {
  program: 'Full Stack Development',
  motivation: 'I am passionate about web development and want to enhance my skills in full-stack development. I believe this program will help me achieve my career goals and contribute to innovative projects.',
  experience: 'I have 2 years of experience in frontend development using React and JavaScript. I have worked on several personal projects and contributed to open-source repositories.',
  goals: 'My goal is to become a senior full-stack developer and eventually lead a development team. I want to master both frontend and backend technologies.',
  availability: {
    startDate: '2025-02-01',
    timeCommitment: 'Full-time (40+ hours/week)'
  },
  technicalSkills: [
    { skill: 'JavaScript', level: 'Advanced' },
    { skill: 'React', level: 'Intermediate' },
    { skill: 'Node.js', level: 'Beginner' }
  ],
  projects: [
    {
      name: 'E-commerce Website',
      description: 'A full-featured e-commerce platform built with React and Node.js',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      url: 'https://example.com',
      githubUrl: 'https://github.com/johndoe/ecommerce'
    }
  ]
};

let authToken = '';

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: User Signup
    console.log('2. Testing User Signup...');
    try {
      const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, testUser);
      console.log('✅ Signup Success:', signupResponse.data);
      authToken = signupResponse.data.token;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('⚠️  User already exists, trying to login instead...');
        
        // Test 3: User Signin (if signup fails due to existing user)
        const signinResponse = await axios.post(`${BASE_URL}/auth/signin`, {
          email: testUser.email,
          password: testUser.password
        });
        console.log('✅ Signin Success:', signinResponse.data);
        authToken = signinResponse.data.token;
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 4: Get Current User
    console.log('3. Testing Get Current User...');
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get User:', meResponse.data);
    console.log('');

    // Test 5: Submit Application
    console.log('4. Testing Submit Application...');
    try {
      const applicationResponse = await axios.post(`${BASE_URL}/applications`, testApplication, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Application Submitted:', applicationResponse.data);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already submitted')) {
        console.log('⚠️  Application already exists for this program');
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 6: Get User Applications
    console.log('5. Testing Get User Applications...');
    const applicationsResponse = await axios.get(`${BASE_URL}/applications`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get Applications:', applicationsResponse.data);
    console.log('');

    // Test 7: Logout
    console.log('6. Testing Logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Logout:', logoutResponse.data);
    console.log('');

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API Test Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

// Run the tests
testAPI();
