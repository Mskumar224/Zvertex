import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';

function Navbar() {
  const history = useHistory();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#007BFF' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ZvertexAI
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        {!isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/student-dashboard">Dashboard</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;