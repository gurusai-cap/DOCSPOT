import React, { useState } from 'react';
import api from '../utils/api';
import Toast from '../components/Toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/register', form);
      setToastMsg(res.data.message);
      setToastType('success');
      setShowToast(true);
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Registration failed');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <Toast message={toastMsg} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" name="role" value={form.role} onChange={handleChange} required>
            <option value="customer">Customer</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
};

export default Register; 