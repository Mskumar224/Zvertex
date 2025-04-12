import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import axios from 'axios';

function Dashboard({ user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState(null);
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    let mounted = true;

    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${apiUrl}/api/auth/subscription`, {
          headers: { 'x-auth-token': token },
        });
        if (mounted) {
          setSubscription(res.data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.msg || 'Failed to load subscription');
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchSubscription();
    } else {
      history.push('/login');
    }

    return () => {
      mounted = false;
    };
  }, [user, history, apiUrl]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/auth/upload-resume`, formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' },
      });
      alert('Resume uploaded successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to upload resume');
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome, {user?.name || 'User'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Subscription Details
                  </Typography>
                  <Typography variant="body1">
                    Plan: {subscription?.plan || 'Free Trial'}
                  </Typography>
                  <Typography variant="body1">
                    Status: {subscription?.status || 'Active'}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: '#ff6d00',
                      '&:hover': { backgroundColor: '#e65100' },
                      color: 'white',
                    }}
                    onClick={() => history.push('/subscription')}
                  >
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Upload Resume
                  </Typography>
                  <input
                    type="file"
                    accept="*/*"
                    onChange={handleResumeUpload}
                    style={{ display: 'block', marginBottom: '16px' }}
                  />
                  <Typography variant="body2">
                    Upload your latest resume to enhance job matching.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                color: 'white',
                borderRadius: '25px',
                px: 4,
                py: 1.5,
              }}
              onClick={() => history.push('/job-matching')}
            >
              Find Jobs
            </Button>
          </Box>
        </Box>
      </Container>
      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>About ZvertexAI</Typography>
              <Typography variant="body2">
                ZvertexAI empowers your career with AI-driven job matching, innovative projects, and ZGPT, your personal copilot.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Quick Links</Typography>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                  Interview FAQs
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                  Why ZvertexAI?
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                  ZGPT Copilot
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                  Contact Us
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Contact Us</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2">
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              © 2025 ZvertexAI. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;