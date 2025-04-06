import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Card, CardContent, Box, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const history = useHistory();
  const [servicesAnchor, setServicesAnchor] = React.useState(null);
  const [projectsAnchor, setProjectsAnchor] = React.useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ subscriptionType: res.data.subscriptionType });
      history.push('/dashboard');
    } catch (err) {
      console.error('Login Error:', err.message, err.response?.data);
      const errorMsg = err.response?.data?.msg || (err.message === 'Network Error' ? 'Server unreachable. Please try again later.' : 'Login failed.');
      alert(errorMsg);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResult('Please enter a search term!');
      return;
    }
    const jobSuggestions = [
      `Looking for "${searchQuery}"? Try our STUDENT plan for $59.99/month—35 job submissions daily!`,
      `Your search for "${searchQuery}" fits our VENDOR plan at $99.99/month—175 submissions/day.`,
      `Interested in "${searchQuery}"? Contact us for our BUSINESS plan!`,
    ];
    setSearchResult(jobSuggestions[Math.floor(Math.random() * jobSuggestions.length)]);
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
            </Menu>
            <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
            <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: '20px', maxHeight: 'calc(100vh - 64px)', overflow: 'hidden', color: 'white' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Typography variant="h5" align="center">Choose Your Plan</Typography>
          <Card sx={{ flex: '1', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <CardContent>
              <Typography variant="h6" color="inherit">Student</Typography>
              <Typography variant="body2" color="inherit">$59.99/Month</Typography>
              <Typography variant="body2">1 Resume, 35 Submissions/Day</Typography>
              <Button variant="contained" color="secondary" size="small" sx={{ mt: 1 }} onClick={() => history.push('/register')}>
                Get Started
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <CardContent>
              <Typography variant="h6" color="inherit">Vendor</Typography>
              <Typography variant="body2" color="inherit">$99.99/Month</Typography>
              <Typography variant="body2">4 Resumes, 175 Submissions/Day</Typography>
              <Button variant="contained" color="secondary" size="small" sx={{ mt: 1 }} onClick={() => history.push('/register')}>
                Get Started
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <CardContent>
              <Typography variant="h6" color="inherit">Business</Typography>
              <Typography variant="body2" color="inherit">Contact Us</Typography>
              <Typography variant="body2">Custom Resumes & Submissions</Typography>
              <Button variant="contained" color="secondary" size="small" sx={{ mt: 1 }} onClick={() => history.push('/register')}>
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h2">Login</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>Access your account</Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
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
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </form>
          <Link href="/forgot-password" sx={{ mt: 1, color: 'white' }}>Forgot Password?</Link>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Search Jobs</Typography>
          <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '400px' }}>
            <TextField
              label="Search Jobs"
              fullWidth
              margin="normal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              Wsx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Search
            </Button>
          </form>
          {searchResult && <Typography sx={{ mt: 2 }}>{searchResult}</Typography>}
        </Box>
      </Box>
    </div>
  );
}

export default Login;