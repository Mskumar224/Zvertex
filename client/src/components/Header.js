import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';

function Header() {
  const history = useHistory();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ZvertexAGI
        </Typography>
        <Button color="inherit" component={Link} to="/signup">Signup</Button>
        <Button color="inherit" component={Link} to="/login">Login</Button>
        {token && (
          <>
            <Button color="inherit" component={Link} to="/student-dashboard">Dashboard</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;