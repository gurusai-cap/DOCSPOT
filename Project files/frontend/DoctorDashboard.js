import React, { useEffect, useState } from 'react';
import api, { logout } from '../utils/api';
import { FaSignOutAlt } from 'react-icons/fa';

const DoctorDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [summaryId, setSummaryId] = useState(null);
  const [visitSummary, setVisitSummary] = useState('');
  const [followUp, setFollowUp] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'doctor') return;
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // Filter appointments for this doctor
        const filtered = res.data.filter(app => app.doctor === user.id);
        setAppointments(filtered);
      } catch (err) {
        setError('Failed to fetch appointments');
      }
    };
    fetchAppointments();
  }, [user, message]);

  const handleConfirm = async (id) => {
    setMessage(''); setError('');
    try {
      await api.put(`/appointments/${id}/status`, { status: 'scheduled' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Appointment confirmed.');
    } catch (err) {
      setError('Failed to confirm appointment');
    }
  };

  const handleReschedule = async (id) => {
    setMessage(''); setError('');
    try {
      await api.put(`/appointments/${id}/status`, { status: 'rescheduled', date: newDate }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Appointment rescheduled.');
      setRescheduleId(null);
      setNewDate('');
    } catch (err) {
      setError('Failed to reschedule appointment');
    }
  };

  const handleSaveSummary = async (id) => {
    setMessage(''); setError('');
    try {
      await api.put(`/appointments/${id}/summary`, { visitSummary, followUpInstructions: followUp }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Visit summary updated.');
      setSummaryId(null);
      setVisitSummary('');
      setFollowUp('');
    } catch (err) {
      setError('Failed to update visit summary');
    }
  };

  if (!user || user.role !== 'doctor') {
    return <div className="container mt-5"><h2>Access denied. Only doctors can view this page.</h2></div>;
  }

  return (
    <div className="container mt-5">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
        <div>
          <h2>Doctor Dashboard</h2>
          <p>Welcome, Dr. {user?.name}!</p>
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
            <th>Patient</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(app => (
            <tr key={app._id}>
              <td>{app.customer}</td>
              <td>{new Date(app.date).toLocaleString()}</td>
              <td>{app.status}</td>
              <td>
                {app.status !== 'cancelled' && app.status !== 'scheduled' && (
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleConfirm(app._id)}>Confirm</button>
                )}
                {app.status !== 'cancelled' && (
                  <>
                    <button className="btn btn-secondary btn-sm me-2" onClick={() => setRescheduleId(app._id)}>Reschedule</button>
                    <button className="btn btn-info btn-sm" onClick={() => { setSummaryId(app._id); setVisitSummary(app.visitSummary || ''); setFollowUp(app.followUpInstructions || ''); }}>Add/Edit Summary</button>
                  </>
                )}
                {rescheduleId === app._id && (
                  <div className="mt-2">
                    <input type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} />
                    <button className="btn btn-primary btn-sm ms-2" onClick={() => handleReschedule(app._id)}>Save</button>
                    <button className="btn btn-link btn-sm" onClick={() => setRescheduleId(null)}>Cancel</button>
                  </div>
                )}
                {summaryId === app._id && (
                  <div className="mt-2">
                    <textarea className="form-control mb-2" placeholder="Visit Summary" value={visitSummary} onChange={e => setVisitSummary(e.target.value)} />
                    <textarea className="form-control mb-2" placeholder="Follow-up Instructions" value={followUp} onChange={e => setFollowUp(e.target.value)} />
                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleSaveSummary(app._id)}>Save</button>
                    <button className="btn btn-link btn-sm" onClick={() => setSummaryId(null)}>Cancel</button>
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

export default DoctorDashboard; 