import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';

function Register({ setUser, user }) {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com'}/api/auth/register`,
        { email, password }
      );
      localStorage.setItem('token', res.data.token);
      setUser({ email: res.data.email, subscriptionType: res.data.subscriptionType });
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Try again.');
    }
  };

  if (user) {
    history.push('/dashboard');
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>ZvertexAI</Typography>
          <Box>
            <Button color="inherit" onClick={handleServicesClick} endIcon={<ArrowDropDownIcon />}>Services</Button>
            <Menu anchorEl={servicesAnchor} open={Boolean(servicesAnchor)} onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}>
              <MenuItem onClick={() => { handleClose(); history.push('/faq'); }}>Interview FAQs</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/why-us'); }}>Why ZvertexAI?</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/zgpt'); }}>ZGPT - Your Copilot</MenuItem>
            </Menu>
            <Button color="inherit" onClick={handleProjectsClick} endIcon={<ArrowDropDownIcon />}>JOIN OUR PROJECTS</Button>
            <Menu anchorEl={projectsAnchor} open={Boolean(projectsAnchor)} onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/saas'); }}>SaaS Solutions</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/cloud'); }}>Cloud Migration</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/ai'); }}>AI Automation</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/bigdata'); }}>Big Data Analytics</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/devops'); }}>DevOps Integration</MenuItem>
            </Menu>
            <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
            <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xs" sx={{ pt: 8 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>Register</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
          />
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}>
            Register
          </Button>
        </form>
        <Button variant="outlined" fullWidth sx={{ mt: 2, color: 'white', borderColor: 'white' }} onClick={() => history.push('/login')}>
          Login Instead
        </Button>
      </Container>
    </Box>
  );
}

export default Register;