import React from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Navbar({ user, setUser }) {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a2a44' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#ff6d00', fontWeight: 'bold' }}>
          ZvertexAI
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => history.push('/')}>Home</Button>
          <Button color="inherit" onClick={() => history.push('/faq')}>FAQs</Button>
          <Button color="inherit" onClick={() => history.push('/why-us')}>Why Us</Button>
          <Button color="inherit" onClick={() => history.push('/projects')}>Projects</Button>
          <Button color="inherit" onClick={() => history.push('/contact-us')}>Contact</Button>
          {user ? (
            <>
              <Button color="inherit" onClick={() => history.push('/dashboard')}>Dashboard</Button>
              <Button color="inherit" onClick={() => history.push('/zgpt')}>ZGPT</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
              <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;