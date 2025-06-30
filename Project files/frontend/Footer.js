import React from 'react';

const Footer = () => (
  <footer style={{
    width: '100%',
    background: 'rgba(25, 118, 210, 0.08)',
    color: '#1976d2',
    textAlign: 'center',
    padding: '1.2rem 0',
    position: 'fixed',
    left: 0,
    bottom: 0,
    zIndex: 99,
    fontWeight: 500,
    fontSize: '1.08rem',
    letterSpacing: '0.5px',
    boxShadow: '0 -2px 12px rgba(25, 118, 210, 0.08)'
  }}>
    © {new Date().getFullYear()} DocSpot &mdash; Book with Confidence | <a href="/" style={{color:'#1565c0', textDecoration:'underline'}}>Home</a> | <a href="/browse" style={{color:'#1565c0', textDecoration:'underline'}}>Browse Doctors</a>
  </footer>
);

export default Footer; 