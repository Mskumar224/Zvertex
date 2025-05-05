import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '@mui/material';

function Navbar() {
  const history = useHistory();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

  return (
    <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#1a2a44', color: 'white' }}>
      <h1 style={{ cursor: 'pointer' }} onClick={() => history.push('/')}>ZvertexAI</h1>
      <div className="nav-links" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px' }}>Home</Link>
        {!token ? (
          <>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px' }}>Signup</Link>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px' }}>Login</Link>
          </>
        ) : (
          <Button
            onClick={handleLogout}
            sx={{
              color: 'white',
              backgroundColor: '#00e676',
              '&:hover': { backgroundColor: '#00c853' },
              textTransform: 'none',
              padding: '5px 15px',
            }}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}

export default Navbar;