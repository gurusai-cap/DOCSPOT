import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateDoctorProfile = () => {
  const [form, setForm] = useState({ specialty: '', location: '', bio: '', availableSlots: '' });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctors/profile', {
        user: user.id,
        specialty: form.specialty,
        location: form.location,
        bio: form.bio,
        availableSlots: form.availableSlots.split(',').map(s => s.trim()),
      });
      toast.success('Profile created!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile creation failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2>Create Doctor Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Specialty</label>
          <input type="text" className="form-control" name="specialty" value={form.specialty} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" className="form-control" name="location" value={form.location} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea className="form-control" name="bio" value={form.bio} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Available Slots (comma separated)</label>
          <input type="text" className="form-control" name="availableSlots" value={form.availableSlots} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Create Profile</button>
      </form>
    </div>
  );
};

export default CreateDoctorProfile; 