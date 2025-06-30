import React, { useEffect, useState } from 'react';
import api, { logout } from '../utils/api';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDoctors(res.data);
      } catch (err) {
        setError('Failed to fetch doctors');
      }
    };
    fetchDoctors();
  }, [user, message]);

  const handleApprove = async (id) => {
    setMessage(''); setError('');
    try {
      await api.put(`/doctors/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Doctor approved.');
    } catch (err) {
      setError('Failed to approve doctor');
    }
  };

  // Filter doctors by name, specialty, or location
  const filteredDoctors = doctors.filter(doc => {
    const search = filter.trim().toLowerCase();
    return (
      doc.user?.name?.toLowerCase().includes(search) ||
      doc.specialty?.toLowerCase().includes(search) ||
      doc.location?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="container mt-5">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
        <div>
          <h2>Admin Dashboard</h2>
          <p>Welcome, Admin {user?.name}!</p>
        </div>
        <button 
          className="btn btn-outline-danger" 
          onClick={logout}
          style={{display:'flex',alignItems:'center',gap:'0.5rem'}}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
      <h4 className="mt-4">Doctor Registrations</h4>
      <div className="mb-3" style={{ maxWidth: 350 }}>
        <input
          className="form-control"
          placeholder="Filter by name, specialty, or location"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Specialty</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.map(doc => (
            <tr key={doc._id}>
              <td>{doc.user?.name}</td>
              <td>{doc.user?.email}</td>
              <td>{doc.specialty}</td>
              <td>{doc.location}</td>
              <td>{doc.user?.isApproved ? 'Approved' : 'Pending'}</td>
              <td>
                {!doc.user?.isApproved && (
                  <button className="btn btn-success btn-sm" onClick={() => handleApprove(doc.user._id)}>Approve</button>
                )}
              </td>
            </tr>
          ))}
          {filteredDoctors.length === 0 && <tr><td colSpan="6">No doctors found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;