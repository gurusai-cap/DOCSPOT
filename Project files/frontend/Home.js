import React from 'react';
import { FaHospitalSymbol, FaUserMd, FaCalendarCheck } from 'react-icons/fa';

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '4rem', color: '#1976d2' }}>
    <FaHospitalSymbol size={64} style={{marginBottom:'1.2rem'}} />
    <h1 style={{fontWeight:800, fontSize:'2.5rem', letterSpacing:'1px'}}>Welcome to DocSpot</h1>
    <p style={{fontSize:'1.25rem', color:'#333', maxWidth:600, margin:'1.5rem auto 2.5rem'}}>
      <FaUserMd style={{marginRight:8, color:'#1976d2'}} />
      Your trusted platform to <b>find top doctors</b>, <b>book appointments</b>, and manage your healthcare journey with ease and confidence.
      <br/>
      <FaCalendarCheck style={{marginRight:8, color:'#1976d2'}} />
      Fast, secure, and always available—DocSpot connects you to quality care, anytime.
    </p>
    <div style={{fontSize:'1.1rem', color:'#1976d2', marginTop:'2.5rem'}}>
      <FaHospitalSymbol size={32} style={{margin:'0 1.2rem'}} />
      <FaUserMd size={32} style={{margin:'0 1.2rem'}} />
      <FaCalendarCheck size={32} style={{margin:'0 1.2rem'}} />
    </div>
  </div>
);

export default Home; 