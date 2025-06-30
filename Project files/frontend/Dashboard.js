import React, { useEffect, useState } from 'react';
import api, { logout } from '../utils/api';
import { FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // Filter appointments for this user
        let filtered = res.data.filter(app => app.customer === user.id);
        // If no real appointments, show demo ones
        if (filtered.length === 0) {
          const demo = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
          filtered = demo.filter(app => app.customer === user.id);
        }
        setAppointments(filtered);
        console.log('Dashboard appointments loaded:', filtered);
      } catch (err) {
        // On error, show demo appointments
        const demo = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
        setAppointments(demo.filter(app => app.customer === user.id));
        setError('Failed to fetch appointments (showing demo bookings)');
      }
    };
    fetchAppointments();
  }, [user, message]);

  const handleCancel = async (id) => {
    setMessage(''); setError('');
    try {
      await api.put(`/appointments/${id}/status`, { status: 'cancelled' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Appointment cancelled.');
    } catch (err) {
      setError('Failed to cancel appointment');
    }
  };

  const handleReschedule = async (id) => {
    setMessage(''); setError('');
    try {
      await api.put(`/appointments/${id}/status`, { status: 'rescheduled', date: newDate }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Appointment rescheduled.');
    } catch (err) {
      setError('Failed to reschedule appointment');
    }
  };

  return (
    <div className="container mt-5">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
        <div>
          <h2>Welcome, {user?.name}!</h2>
          <p>Role: {user?.role}</p>
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
      <h4 className="mt-4">Your Appointments</h4>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(app => (
            <tr key={app._id}>
              <td>{app.doctorProfile?.user?.name || app.doctorProfile?.name || 'Doctor'}</td>
              <td>{new Date(app.date).toLocaleString()}</td>
              <td>{app.status}</td>
              <td>
                {app.status !== 'cancelled' && (
                  <>
                    <button className="btn btn-danger btn-sm me-2" onClick={() => handleCancel(app._id)}>Cancel</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setRescheduleId(app._id)}>Reschedule</button>
                  </>
                )}
                {rescheduleId === app._id && (
                  <div className="mt-2">
                    <input type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} />
                    <button className="btn btn-primary btn-sm ms-2" onClick={() => handleReschedule(app._id)}>Save</button>
                    <button className="btn btn-link btn-sm" onClick={() => setRescheduleId(null)}>Cancel</button>
                  </div>
                )}
                {app.visitSummary && (
                  <div className="mt-2">
                    <strong>Visit Summary:</strong> {app.visitSummary}<br/>
                    <strong>Follow-up:</strong> {app.followUpInstructions}
                  </div>
                )}
                {/* Show specialty/location for demo appointments */}
                {app.doctorProfile?.specialty && (
                  <div style={{fontSize:'0.95rem',color:'#1976d2'}}>
                    <div>Specialty: {app.doctorProfile.specialty}</div>
                    <div>Location: {app.doctorProfile.location}</div>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {appointments.length === 0 && <tr><td colSpan="4">No appointments found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;