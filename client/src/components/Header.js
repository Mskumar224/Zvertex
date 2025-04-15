import React from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Header({ user, setUser }) {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  return (
    <AppBar
      position="sticky"
      sx={{ background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', boxShadow: 'none' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => history.push('/')}
        >
          ZvertexAI
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => history.push('/why-zvertexai')}>
            Why ZvertexAI
          </Button>
          <Button color="inherit" onClick={() => history.push('/zgpt')}>
            ZGPT
          </Button>
          <Button color="inherit" onClick={() => history.push('/matches')}>
            Matches
          </Button>
          <Button color="inherit" onClick={() => history.push('/contact-us')}>
            Contact Us
          </Button>
          {user ? (
            <>
              <Button color="inherit" onClick={() => history.push('/dashboard')}>
                Dashboard
              </Button>
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => history.push('/login')}>
                Login
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                onClick={() => history.push('/register')}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;