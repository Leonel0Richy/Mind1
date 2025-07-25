const axios = require('axios');

async function quickTest() {
  try {
    console.log('🧪 Quick API Test...');
    
    // Test health endpoint
    const health = await axios.get('http://localhost:5004/api/health');
    console.log('✅ Health check passed:', health.data.data.status);
    console.log('📊 Storage mode:', health.data.data.storage.mode);
    
    // Test registration
    const user = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'TestPass123!',
      phone: '+1234567890'
    };
    
    const register = await axios.post('http://localhost:5004/api/auth/register', user);
    console.log('✅ Registration passed:', register.data.success);
    console.log('🔑 Token received:', !!register.data.data.tokens.accessToken);
    
    const token = register.data.data.tokens.accessToken;
    
    // Test get user
    const me = await axios.get('http://localhost:5004/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get user passed:', me.data.data.user.email);
    
    console.log('🎉 All basic tests passed!');
    
  } catch (error) {
    console.log('❌ Test failed:', error.response?.data || error.message);
  }
}

quickTest();
