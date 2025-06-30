import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateDoctorProfile from './pages/CreateDoctorProfile';
import Footer from './components/Footer';
import { FaStethoscope, FaSignOutAlt } from 'react-icons/fa';
import { logout } from './utils/api';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isAuthenticated = user && token;

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid" style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
          <Link className="navbar-brand" to="/">
            <FaStethoscope style={{marginRight:'0.5rem',color:'#1976d2',verticalAlign:'-3px'}} />
            DocSpot
          </Link>
          <div style={{display:'flex',gap:'1.1rem',flexWrap:'wrap',alignItems:'center'}}>
            {!isAuthenticated ? (
              <>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="nav-link" to="/register">Register</Link>
              </>
            ) : (
              <>
                <span className="nav-link" style={{color:'#1976d2',fontWeight:'500'}}>
                  Welcome, {user?.name}!
                </span>
                <Link className="nav-link" to="/doctors">Browse Doctors</Link>
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                {user?.role === 'doctor' && (
                  <Link className="nav-link" to="/doctor-dashboard">Doctor Dashboard</Link>
                )}
                {user?.role === 'admin' && (
                  <Link className="nav-link" to="/admin-dashboard">Admin Dashboard</Link>
                )}
                {user?.role === 'doctor' && (
                  <Link className="nav-link" to="/create-doctor-profile">Create Doctor Profile</Link>
                )}
                <button 
                  className="btn btn-outline-danger btn-sm" 
                  onClick={handleLogout}
                  style={{display:'flex',alignItems:'center',gap:'0.5rem'}}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/book/:id" element={<BookAppointment />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/create-doctor-profile" element={<CreateDoctorProfile />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App; 