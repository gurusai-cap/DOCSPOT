const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function createTestUsers() {
  const testUsers = [
    {
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      role: 'user'
    },
    {
      name: 'Dr. Test Doctor',
      email: 'doctor@test.com',
      password: 'password123',
      role: 'doctor'
    },
    {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    }
  ];

  for (const user of testUsers) {
    try {
      console.log(`Creating ${user.role} user: ${user.email}`);
      const registerRes = await axios.post(`${API_BASE}/users/register`, user);
      console.log(`${user.role} registered successfully:`, registerRes.data.message);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log(`${user.role} already exists: ${user.email}`);
      } else {
        console.error(`Registration error for ${user.role}:`, err.response ? err.response.data : err.message);
      }
    }
  }

  // Test login for each user
  console.log('\n--- Testing Login ---');
  for (const user of testUsers) {
    try {
      console.log(`Testing login for: ${user.email}`);
      const loginRes = await axios.post(`${API_BASE}/users/login`, {
        email: user.email,
        password: user.password
      });
      console.log(`✅ Login successful for ${user.email}:`, {
        name: loginRes.data.user.name,
        role: loginRes.data.user.role,
        token: loginRes.data.token ? 'Present' : 'Missing'
      });
    } catch (err) {
      console.error(`❌ Login failed for ${user.email}:`, err.response ? err.response.data : err.message);
    }
  }
}

createTestUsers(); 