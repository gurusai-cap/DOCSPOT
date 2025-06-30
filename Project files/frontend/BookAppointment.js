import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const BookAppointment = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get('/doctors');
        setDoctor(res.data.find(doc => doc._id === id));
      } catch (err) {
        setToastMsg('Failed to fetch doctor info');
        setToastType('error');
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setToastMsg('You must be logged in to book an appointment.');
      setToastType('error');
      setShowToast(true);
      return;
    }
    const formData = new FormData();
    formData.append('customer', user.id);
    formData.append('doctor', doctor.user._id);
    formData.append('doctorProfile', doctor._id);
    formData.append('date', date);
    formData.append('notes', notes);
    if (document) formData.append('documents', document);
    try {
      await api.post('/appointments/book', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setToastMsg('Appointment booked successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Booking failed');
      setToastType('error');
      setShowToast(true);
    }
  };

  if (loading) return <Spinner />;
  if (!doctor) return <div className="container mt-5">Loading doctor info...</div>;

  return (
    <>
      <Toast message={toastMsg} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
      <div className="container mt-5" style={{ maxWidth: 500 }}>
        <h2>Book Appointment with {doctor.user.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Date & Time</label>
            <input type="datetime-local" className="form-control" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Notes</label>
            <textarea className="form-control" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Document (optional)</label>
            <input type="file" className="form-control" onChange={handleFileChange} />
          </div>
          <button type="submit" className="btn btn-primary w-100">Book Appointment</button>
        </form>
      </div>
    </>
  );
};

export default BookAppointment; 