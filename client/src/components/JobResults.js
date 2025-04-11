import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Divider, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

function JobResults() {
  const history = useHistory();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = localStorage.getItem('token') ? true : false;
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    const fetchJobs = async () => {
      const params = new URLSearchParams(location.search);
      const jobTitle = params.get('jobTitle');
      const locationParam = params.get('location');

      if (!jobTitle || !locationParam) {
        setError('Missing job title or location');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(
          `${apiUrl}/api/jobs/fetch`,
          { technology: jobTitle, location: locationParam },
          { headers: { 'x-auth-token': token || '' } }
        );
        setJobs(res.data.jobs);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [location]);

  const handleApply = async (job) => {
    if (!user) {
      history.push('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${apiUrl}/api/jobs/apply`,
        { 
          jobId: job.id, 
          technology: job.title.split(' ')[0], 
          userDetails: { email: 'user@example.com' }, // Replace with actual user email from state
          jobTitle: job.title,
          company: job.company
        },
        { headers: { 'x-auth-token': token } }
      );
      alert(`Applied to ${job.title} at ${job.company}! Check your email for confirmation.`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to apply');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ py: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => history.goBack()}
            sx={{ color: '#ff6d00', mb: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
            Job Search Results
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
          {loading ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <CircularProgress sx={{ color: '#ff6d00' }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {jobs.length > 0 ? (
                jobs.map((job, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ 
                      backgroundColor: '#1e1e1e', 
                      color: 'white', 
                      borderRadius: '15px', 
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {job.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {job.company}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                          {job.description}
                        </Typography>
                        <Button 
                          variant="contained" 
                          sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }} 
                          onClick={() => handleApply(job)}
                        >
                          {user ? 'Apply Now' : 'Login to Apply'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
                  No jobs found matching your criteria.
                </Typography>
              )}
            </Grid>
          )}
        </Box>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                ZvertexAI empowers careers with AI-driven job matching, innovative projects, and ZGPT, your personal copilot. Join us to shape the future of technology.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quick Links
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-zvertexai')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/interview-faqs')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                Contact Us
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  5900 Balcones Dr #16790, Austin, TX 78731
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  (737) 239-0920
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                  contact@zvertexai.com
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }} 
                onClick={() => history.push('/register')}
              >
                Subscribe Now
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" align="center">
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default JobResults;