import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '@mui/material';

function Navbar() {
  const history = useHistory();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <div className="header">
      <h1 onClick={() => history.push('/')}>ZvertexAI</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {!token ? (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Button onClick={handleLogout} sx={{ color: '#f28c38', ml: 2 }}>
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;