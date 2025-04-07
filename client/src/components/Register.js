import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Box, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Register({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('STUDENT');
  const history = useHistory();
  const [servicesAnchor, setServicesAnchor] = React.useState(null);
  const [projectsAnchor, setProjectsAnchor] = React.useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting registration process:', { email, subscriptionType });
    try {
      console.log('Sending registration request to:', `${apiUrl}/api/auth/register`);
      const res = await axios.post(`${apiUrl}/api/auth/register`, { email, password, subscriptionType });
      console.log('User registered successfully:', res.data);
      localStorage.setItem('token', res.data.token);
      setUser({ subscriptionType: res.data.subscriptionType });
      history.push('/dashboard');
    } catch (err) {
      console.error('Register Error:', err.message, err.response?.data);
      alert(err.response?.data?.msg || 'Registration failed.');
    }
  };

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>
            ZvertexAI
          </Typography>
          <Box>
            <Button color="inherit" onClick={handleServicesClick} endIcon={<ArrowDropDownIcon />}>
              Services
            </Button>
            <Menu
              anchorEl={servicesAnchor}
              open={Boolean(servicesAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}
            >
              <MenuItem onClick={() => history.push('/contact')}>Contact Us</MenuItem>
              <MenuItem onClick={() => history.push('/faq')}>Interview FAQs</MenuItem>
              <MenuItem onClick={() => history.push('/why-us')}>Why ZvertexAI?</MenuItem>
            </Menu>
            <Button color="inherit" onClick={handleProjectsClick} endIcon={<ArrowDropDownIcon />}>
              Join Our Projects!
            </Button>
            <Menu
              anchorEl={projectsAnchor}
              open={Boolean(projectsAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}
            >
              <MenuItem onClick={handleClose}>SaaS Solutions</MenuItem>
              <MenuItem onClick={handleClose}>Cloud Migration</MenuItem>
              <MenuItem onClick={handleClose}>AI Automation</MenuItem>
              <MenuItem onClick={handleClose}>Big Data Analytics</MenuItem>
              <MenuItem onClick={handleClose}>DevOps Integration</MenuItem>
              <MenuItem onClick={() => history.push('/projects')}>View Projects</MenuItem> {/* New */}
            </Menu>
            <Button color="inherit" onClick={() => history.push('/zgpt')}>Zgpt</Button> {/* New */}
            <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
            <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <Box sx={{ width: '100%', maxWidth: '400px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <Typography variant="h2" align="center" sx={{ color: 'white' }}>Register</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
            />
            <TextField
              select
              label="Subscription Type"
              fullWidth
              margin="normal"
              value={subscriptionType}
              onChange={(e) => setSubscriptionType(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
            >
              <option value="STUDENT">Student</option>
              <option value="VENDOR">Vendor</option>
              <option value="BUSINESS">Business</option>
            </TextField>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
          </form>
        </Box>
      </Box>
    </div>
  );
}

export default Register;