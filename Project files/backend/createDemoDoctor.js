const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function createDemoDoctor() {
  try {
    // 1. Register doctor
    const registerRes = await axios.post(`${API_BASE}/users/register`, {
      name: 'Dr. Demo',
      email: 'drdemo@example.com',
      password: 'password123',
      role: 'doctor',
    });
    console.log('Doctor registered:', registerRes.data);
  } catch (err) {
    if (err.response && err.response.status === 400) {
      console.log('Doctor already registered, proceeding to login...');
    } else {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      return;
    }
  }

  try {
    // 2. Login doctor
    const loginRes = await axios.post(`${API_BASE}/users/login`, {
      email: 'drdemo@example.com',
      password: 'password123',
    });
    const token = loginRes.data.token;
    const userId = loginRes.data.user._id;
    console.log('Doctor logged in:', loginRes.data.user);

    // 3. Create doctor profile
    try {
      const profileRes = await axios.post(
        `${API_BASE}/doctors/profile`,
        {
          specialty: 'Cardiology',
          location: 'New York',
          bio: 'Demo doctor for testing.',
          availableSlots: [new Date(Date.now() + 86400000)],
          documents: []
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Doctor profile created:', profileRes.data);
    } catch (err) {
      if (err.response) {
        console.error('Profile creation error details:', err.response.data);
      }
      if (err.response && err.response.status === 400) {
        console.log('Doctor profile may already exist.');
      } else {
        console.error('Login/Profile error:', err.response ? err.response.data : err.message);
      }
    }

    // 3. Create doctor profile (public, no auth, for debugging)
    try {
      const publicProfileRes = await axios.post(
        `${API_BASE}/doctors/public-profile`,
        {
          specialty: 'Cardiology',
          location: 'New York',
          bio: 'Demo doctor for testing.',
          availableSlots: [new Date(Date.now() + 86400000)],
          user: userId
        }
      );
      console.log('Doctor profile created (public route):', publicProfileRes.data);
    } catch (err) {
      if (err.response) {
        console.error('Public profile creation error details:', err.response.data);
      }
      if (err.response && err.response.status === 400) {
        console.log('Doctor profile may already exist (public route).');
      } else {
        console.error('Login/Public Profile error:', err.response ? err.response.data : err.message);
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      console.log('Doctor profile may already exist.');
    } else {
      console.error('Login/Profile error:', err.response ? err.response.data : err.message);
    }
  }
}

createDemoDoctor(); 