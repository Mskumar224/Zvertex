import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header style={{ 
      background: '#007bff', 
      color: '#fff', 
      padding: '15px 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>ZvertexAI</h1>
      <nav>
        <Link to="/" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>Home</Link>
        <Link to="/projects" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>Projects</Link>
        <Link to="/contact" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>Contact</Link>
        {token ? (
          <>
            <Link to="/dashboard" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/profile" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>Profile</Link>
            <Link to="/resume-upload" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>Upload Resume</Link>
            <button 
              onClick={logout} 
              style={{ 
                color: '#fff', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '16px' 
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', margin: '0 15px', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;