import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function Sidebar({ user, setUser }) {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  return (
    <Box
      sx={{
        width: '250px',
        background: 'rgba(255,255,255,0.05)',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Typography variant="h6" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
        ZvertexAI
      </Typography>
      <Button
        sx={{ color: 'white', justifyContent: 'flex-start', mb: 2, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={() => history.push('/dashboard')}
      >
        Dashboard
      </Button>
      <Button
        sx={{ color: 'white', justifyContent: 'flex-start', mb: 2, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={() => history.push('/matches')}
      >
        Matches
      </Button>
      <Button
        sx={{ color: 'white', justifyContent: 'flex-start', mb: 2, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={() => history.push('/zgpt')}
      >
        ZGPT
      </Button>
      <Button
        sx={{ color: 'white', justifyContent: 'flex-start', mb: 2, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={() => history.push('/subscription')}
      >
        Subscription
      </Button>
      <Button
        sx={{ color: 'white', justifyContent: 'flex-start', mb: 2, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={() => history.push('/contact-us')}
      >
        Contact Us
      </Button>
      <Button
        sx={{ color: '#ff6d00', justifyContent: 'flex-start', mt: 'auto', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
}

export default Sidebar;