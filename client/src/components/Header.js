import React from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  margin: '0 10px',
  '&:hover': {
    backgroundColor: '#ff6d00',
  },
}));

function Header({ user, setUser }) {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a2a44' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => history.push('/')}>
          ZvertexAI
        </Typography>
        <Box>
          <StyledButton onClick={() => history.push('/')}>Home</StyledButton>
          <StyledButton onClick={() => history.push('/why-zvertexai')}>Why ZvertexAI</StyledButton>
          <StyledButton onClick={() => history.push('/interview-faqs')}>Interview FAQs</StyledButton>
          <StyledButton onClick={() => history.push('/zgpt')}>ZGPT</StyledButton>
          <StyledButton onClick={() => history.push('/contact-us')}>Contact Us</StyledButton>
          {user ? (
            <>
              <StyledButton onClick={() => history.push('/dashboard')}>Dashboard</StyledButton>
              <StyledButton onClick={() => history.push('/subscription')}>Subscription</StyledButton>
              <StyledButton onClick={handleLogout}>Logout</StyledButton>
            </>
          ) : (
            <StyledButton onClick={() => history.push('/login')}>Login</StyledButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;