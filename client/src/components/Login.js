import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Card, CardContent, Box } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const history = useHistory();

  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({ subscriptionType: res.data.subscriptionType });
      history.push('/dashboard');
    } catch (err) {
      console.error('Login Error:', err.response);
      alert(err.response?.data.msg || 'Login failed');
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

  const goHome = () => history.push('/');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="header">
        <h1 onClick={goHome}>ZvertexAI</h1>
        <div className="nav-links">
          <Link href="/login">Login</Link>
          <Link href="/register" style={{ marginLeft: '20px' }}>Register</Link>
        </div>
      </div>

      <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: '20px', maxHeight: 'calc(100vh - 80px)', overflow: 'hidden' }}>
        {/* Plans Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Typography variant="h5" align="center">Choose Your Plan</Typography>
          <Card sx={{ flex: '1', backgroundColor: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary">Student</Typography>
              <Typography variant="body2" color="secondary">$59.99/Month</Typography>
              <Typography variant="body2">1 Resume, 35 Submissions/Day</Typography>
              <Button variant="contained" color="secondary" size="small" sx={{ mt: 1 }} onClick={() => history.push('/register')}>
                Get Started
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1', backgroundColor: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary">Vendor</Typography>
              <Typography variant="body2" color="secondary">$99.99/Month</Typography>
              <Typography variant="body2">4 Resumes, 175 Submissions/Day</Typography>
              <Button variant="contained" color="secondary" size="small" sx={{ mt: 1 }} onClick={() => history.push('/register')}>
                Get Started
              </Button>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1', backgroundColor: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary">Business</Typography>
              <Typography variant="body2" color="secondary">Contact Us</Typography>
              <Typography variant="body2">5 Recruiters, Custom Pricing</Typography>
              <Button variant="contained" color="secondary" size="small" sx={{ mt: 1 }} onClick={() => window.location.href = 'mailto:support@zvertexai.com'}>
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* ZAP Section */}
        <Box sx={{ backgroundColor: '#1a2a44', color: 'white', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" gutterBottom>Meet ZAP</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>ZAP it until unknown to be known</Typography>
          <form onSubmit={handleSearch}>
            <TextField
              label="Ask ZAP"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: '5px', mb: 2 }}
              size="small"
            />
            <Button type="submit" variant="contained" color="secondary" size="small">
              ZAP It
            </Button>
          </form>
          {searchResult && (
            <Typography variant="body2" sx={{ mt: 2, backgroundColor: '#f28c38', padding: '5px', borderRadius: '5px' }}>
              {searchResult}
            </Typography>
          )}
        </Box>

        {/* Login Form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>
          <Card sx={{ padding: '20px', boxShadow: 3 }}>
            <Typography variant="h5" align="center">Welcome Back</Typography>
            <Typography variant="body2" align="center" sx={{ mb: 2 }}>Log in to get started</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} size="small">
                Login
              </Button>
              <Typography align="center" sx={{ mt: 1 }}>
                <Link href="/forgot-password" fontSize="small">Forgot Password?</Link>
              </Typography>
            </form>
          </Card>
        </Box>
      </Box>
    </div>
  );
}

export default Login;