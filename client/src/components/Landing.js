import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';

function Landing({ user }) {
  const [technology, setTechnology] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSearch = async () => {
    setError('');
    try {
      const response = await axios.post(`${apiUrl}/api/jobs/fetch`, { technology, location });
      setJobs(response.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch jobs');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome to ZvertexAI
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Your AI-Powered Career Companion
          </Typography>
          <Box sx={{ mb: 4 }}>
            <TextField
              label="Technology"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              sx={{
                mr: 2,
                input: { color: 'white' },
                label: { color: 'white' },
                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
              }}
            />
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{
                mr: 2,
                input: { color: 'white' },
                label: { color: 'white' },
                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                color: 'white',
                borderRadius: '25px',
                px: 4,
                py: 1.5,
              }}
            >
              Search Jobs
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Grid container spacing={3}>
            {jobs.map((job, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
                  <CardContent>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="body2">{job.company}</Typography>
                    <Typography variant="body2">{job.location}</Typography>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                        backgroundColor: '#ff6d00',
                        '&:hover': { backgroundColor: '#e65100' },
                        color: 'white',
                      }}
                      onClick={() => (user ? alert('Applying...') : history.push('/register'))}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Why Choose ZvertexAI?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Leverage our AI-driven job matching, collaborate on innovative projects, and get personalized guidance with ZGPT.
            </Typography>
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
              onClick={() => history.push('/why-us')}
            >
              Learn More
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

export default Landing;