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
  console.log('API URL being used:', apiUrl);

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

    // Simulate a search response with job-related suggestions
    const jobSuggestions = [
      `Looking for "${searchQuery}"? How about exploring job opportunities in this field? Subscribe to our STUDENT plan for $59.99/month and submit your resume to 35 jobs daily!`,
      `Your search for "${searchQuery}" could lead to a great career! Our VENDOR plan at $99.99/month lets you manage 4 resumes with 175 submissions per day.`,
      `Interested in "${searchQuery}"? Businesses can hire top talent with our BUSINESS plan—contact us for custom pricing!`,
    ];
    const randomSuggestion = jobSuggestions[Math.floor(Math.random() * jobSuggestions.length)];
    setSearchResult(randomSuggestion);
  };

  const goHome = () => history.push('/');

  return (
    <div>
      <div className="header">
        <h1 onClick={goHome}>ZvertexAI</h1>
        <div className="nav-links">
          <Link href="/register">Register</Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero">
        <Typography variant="h2">Welcome to ZvertexAI</Typography>
        <Typography variant="body1">Your gateway to smarter job applications</Typography>
      </div>

      {/* Subscription Plans Section */}
      <Box sx={{ padding: '40px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Choose Your Plan</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Student Plan */}
          <Card sx={{ width: 300, backgroundColor: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" color="primary">Student</Typography>
              <Typography variant="h6" color="secondary">$59.99/Month</Typography>
              <Typography variant="body2">1 Resume</Typography>
              <Typography variant="body2">35 Submissions/Day</Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => history.push('/register')}>
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Vendor Plan */}
          <Card sx={{ width: 300, backgroundColor: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" color="primary">Vendor</Typography>
              <Typography variant="h6" color="secondary">$99.99/Month</Typography>
              <Typography variant="body2">4 Resumes</Typography>
              <Typography variant="body2">175 Submissions/Day</Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => history.push('/register')}>
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card sx={{ width: 300, backgroundColor: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" color="primary">Business</Typography>
              <Typography variant="h6" color="secondary">Contact Us</Typography>
              <Typography variant="body2">5 Recruiters Allowed</Typography>
              <Typography variant="body2">Price Based on Usage</Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => window.location.href = 'mailto:support@zvertexai.com'}>
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Zgpt Mini Search Bot Section */}
      <Box sx={{ padding: '40px', textAlign: 'center', backgroundColor: '#1a2a44', color: 'white', borderRadius: '10px', maxWidth: '600px', margin: '0 auto 40px' }}>
        <Typography variant="h4" gutterBottom>Meet Zgpt - Your Job Search Companion</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Ask Zgpt anything and get job-related insights to boost your career!
        </Typography>
        <form onSubmit={handleSearch}>
          <TextField
            label="Search with Zgpt"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: '5px', mb: 2 }}
          />
          <Button type="submit" variant="contained" color="secondary" sx={{ padding: '10px 20px' }}>
            Search
          </Button>
        </form>
        {searchResult && (
          <Typography variant="body2" sx={{ mt: 2, backgroundColor: '#f28c38', padding: '10px', borderRadius: '5px', display: 'inline-block' }}>
            {searchResult}
          </Typography>
        )}
      </Box>

      {/* Login Section */}
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <Typography variant="h5" align="center">Welcome Back</Typography>
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>Log in to manage your job applications</Typography>
        <button className="back-button" onClick={() => history.goBack()}>
          Back
        </button>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            <Link href="/forgot-password">Forgot Password?</Link>
          </Typography>
        </form>
      </div>
    </div>
  );
}

export default Login;