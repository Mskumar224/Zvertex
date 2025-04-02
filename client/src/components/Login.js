import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Card, CardContent, Box } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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
      setSearchResults([{ type: 'error', content: 'Please enter a search term!' }]);
      return;
    }

    // Simulated professional job search responses
    const mockResponses = [
      {
        type: 'job',
        content: `Found a job match for "${searchQuery}": Software Engineer at TechCorp. Location: Remote. Salary: $90k-$120k. Apply now with our STUDENT plan ($59.99/month) for 35 daily submissions!`,
      },
      {
        type: 'advice',
        content: `Searching for "${searchQuery}"? Tailor your resume with keywords like "teamwork" and "innovation" to stand out. Upgrade to VENDOR ($99.99/month) to manage 4 resumes!`,
      },
      {
        type: 'market',
        content: `Market insight for "${searchQuery}": Demand for this skill is up 15% this year. Businesses can hire talent with our BUSINESS plan—contact us for details!`,
      },
    ];

    // Randomly select 1-3 responses for variety
    const shuffled = mockResponses.sort(() => 0.5 - Math.random());
    setSearchResults(shuffled.slice(0, Math.floor(Math.random() * 3) + 1));
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

      <div className="hero">
        <Typography variant="h2">Welcome to ZvertexAI</Typography>
        <Typography variant="body1">Your gateway to smarter job applications</Typography>
      </div>

      <Box sx={{ padding: '40px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Choose Your Plan</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
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

      <Box className="zgpt-container" sx={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', maxWidth: '800px', margin: '0 auto 40px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1a2a44' }}>Zgpt - Job Search Assistant</Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
          Ask Zgpt anything about jobs, careers, or skills, and get instant insights!
        </Typography>
        <form onSubmit={handleSearch} className="zgpt-search-form">
          <TextField
            label="Ask Zgpt (e.g., 'software engineer jobs')"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2, backgroundColor: '#f5f6fa', borderRadius: '5px' }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ padding: '12px 24px', fontSize: '16px' }}>
            Search
          </Button>
        </form>
        {searchResults.length > 0 && (
          <Box className="zgpt-results" sx={{ mt: 3, textAlign: 'left' }}>
            {searchResults.map((result, index) => (
              <Box key={index} sx={{ p: 2, mb: 2, backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #f28c38' }}>
                <Typography variant="body1" sx={{ color: '#1a2a44' }}>
                  {result.content}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

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
        <Typography align="center" sx={{ mt: 2, color: '#666' }}>
          For testing: Use <strong>test@zvertexai.com</strong> with password <strong>test1234</strong>
        </Typography>
      </div>
    </div>
  );
}

export default Login;