import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const history = useHistory();
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      history.push('/login');
      alert('Logged out successfully');
    } catch (error) {
      alert('Logout failed!');
    }
  };

  return (
    <AppBar position="static" sx={{ background: '#1a2a44' }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1, color: 'white' }}
            component={Link}
            to="/"
            style={{ textDecoration: 'none' }}
          >
            ZvertexAI
          </Typography>
          <Button color="inherit" component={Link} to="/" sx={{ color: 'white' }}>Home</Button>
          {!token ? (
            <>
              <Button color="inherit" component={Link} to="/signup" sx={{ color: 'white' }}>Signup</Button>
              <Button color="inherit" component={Link} to="/login" sx={{ color: 'white' }}>Login</Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout} sx={{ color: 'white' }}>Logout</Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;