import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserMd, FaHeartbeat, FaBrain, FaTooth, FaBaby, FaLungs, FaEye, FaBone } from 'react-icons/fa';
import Toast from '../components/Toast';

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
    <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const specialties = [
  { name: 'Cardiologist', icon: <FaHeartbeat color="#d32f2f" size={28} /> },
  { name: 'Neurologist', icon: <FaBrain color="#1976d2" size={28} /> },
  { name: 'Dentist', icon: <FaTooth color="#388e3c" size={28} /> },
  { name: 'Pediatrician', icon: <FaBaby color="#fbc02d" size={28} /> },
  { name: 'Pulmonologist', icon: <FaLungs color="#0288d1" size={28} /> },
  { name: 'Ophthalmologist', icon: <FaEye color="#512da8" size={28} /> },
  { name: 'Orthopedic', icon: <FaBone color="#6d4c41" size={28} /> },
  { name: 'General Physician', icon: <FaUserMd color="#1976d2" size={28} /> },
];

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);
  const [showCenterAlert, setShowCenterAlert] = useState(false);
  const [centerAlertMsg, setCenterAlertMsg] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get('/doctors');
        setDoctors(res.data.filter(doc => doc.user.isApproved));
      } catch (err) {
        toast.error('Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let result = doctors;
    if (specialty) result = result.filter(doc => doc.specialty.toLowerCase() === specialty.toLowerCase());
    if (location) result = result.filter(doc => doc.location.toLowerCase().includes(location.toLowerCase()));
    setFiltered(result);
  }, [specialty, location, doctors]);

  const handleBookNow = async (doc) => {
    alert('Clicked!');
    console.log('Book Now clicked for doctor:', doc);
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setToastMsg('You must be logged in to book an appointment.');
      setToastType('error');
      setShowToast(true);
      console.log('No user found in localStorage');
      return;
    }
    try {
      const res = await api.post('/appointments/book', {
        customer: user.id,
        doctor: doc.user._id,
        doctorProfile: doc._id,
        date: new Date().toISOString(),
        notes: 'Quick booking from Browse Doctors',
      });
      console.log('Booking API response:', res.data);
      setToastMsg('Appointment booked successfully! Redirecting...');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      console.log('Booking failed:', err);
      setToastMsg('Booking failed: ' + (err.response?.data?.message || 'Unknown error'));
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleExampleBookNow = (name, specialty, location) => {
    setCenterAlertMsg('Appointment booked!');
    setShowCenterAlert(true);
    setTimeout(() => setShowCenterAlert(false), 1500);
    // Add fake appointment to localStorage for dashboard demo
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    const fakeAppointment = {
      _id: 'demo-' + Date.now(),
      doctorProfile: { user: { name }, specialty, location },
      date: new Date().toISOString(),
      status: 'booked',
      customer: user.id,
    };
    const appointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
    appointments.push(fakeAppointment);
    localStorage.setItem('demoAppointments', JSON.stringify(appointments));
    console.log('Demo appointments after booking:', JSON.parse(localStorage.getItem('demoAppointments')));
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mt-5" style={{position:'relative'}}>
      {showCenterAlert && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.18)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            padding: '2.5rem 3.5rem',
            borderRadius: '18px',
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
            fontSize: '1.35rem',
            color: '#1976d2',
            fontWeight: 700,
            textAlign: 'center',
          }}>{centerAlertMsg}</div>
        </div>
      )}
      <Toast message={toastMsg} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
      <h2>Available Doctors</h2>
      <div style={{display:'flex',justifyContent:'center',gap:'2.2rem',flexWrap:'wrap',margin:'2rem 0 2.5rem'}}>
        {specialties.map(s => (
          <div key={s.name} style={{display:'flex',flexDirection:'column',alignItems:'center',cursor:'pointer'}} onClick={()=>{setSpecialty(s.name); setLocation('');}}>
            {s.icon}
            <span style={{marginTop:6,fontWeight:600,color:'#1976d2',fontSize:'1.05rem'}}>{s.name}</span>
          </div>
        ))}
      </div>
      <div className="row mb-3">
        <div className="col">
          <input className="form-control" placeholder="Filter by specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} />
        </div>
        <div className="col">
          <input className="form-control" placeholder="Filter by location" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
      </div>
      <div className="row">
        {filtered.length > 0 ? (
          filtered.map(doc => (
            <div className="col-md-4 mb-4" key={doc._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{doc.user.name}</h5>
                  <p className="card-text">Specialty: {doc.specialty}</p>
                  <p className="card-text">Location: {doc.location}</p>
                  <button className="btn btn-primary" style={{cursor:'pointer'}} onClick={() => handleBookNow(doc)}>Book Now</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">D.Gurusai</h5>
                  <p className="card-text">Specialty: Cardiologist</p>
                  <p className="card-text">Location: Mumbai</p>
                  <button className="btn btn-primary" style={{cursor:'pointer'}} onClick={() => handleExampleBookNow('D.Gurusai', 'Cardiologist', 'Mumbai')}>Book Now</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">G.Anushka</h5>
                  <p className="card-text">Specialty: Dentist</p>
                  <p className="card-text">Location: Delhi</p>
                  <button className="btn btn-primary" style={{cursor:'pointer'}} onClick={() => handleExampleBookNow('G.Anushka', 'Dentist', 'Delhi')}>Book Now</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">B.Srilatha</h5>
                  <p className="card-text">Specialty: Pediatrician</p>
                  <p className="card-text">Location: Bangalore</p>
                  <button className="btn btn-primary" style={{cursor:'pointer'}} onClick={() => handleExampleBookNow('B.Srilatha', 'Pediatrician', 'Bangalore')}>Book Now</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorList; 