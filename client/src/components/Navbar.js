import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
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
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1, color: 'white', fontSize: { xs: '1rem', sm: '1.25rem' } }}
            component={Link}
            to="/"
            style={{ textDecoration: 'none' }}
          >
            ZvertexAI
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button color="inherit" component={Link} to="/" sx={{ color: 'white', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Home
            </Button>
            {token ? (
              <>
                <Button color="inherit" component={Link} to="/dashboard" sx={{ color: 'white', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/subscription" sx={{ color: 'white', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Subscription
                </Button>
                <Button color="inherit" onClick={handleLogout} sx={{ color: 'white', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/signup" sx={{ color: 'white', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Signup
                </Button>
                <Button color="inherit" component={Link} to="/login" sx={{ color: 'white', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;