import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

function Dashboard({ user }) {
  const history = useHistory();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const subscriptionStatus = user?.subscriptionStatus || 'Free';

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${apiUrl}/api/jobs`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        params: { limit: 3 },
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const handleApply = async (jobId) => {
    try {
      await axios.post(
        `${apiUrl}/api/jobs/apply`,
        { jobId },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to apply');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            Welcome, {user?.name || 'User'}!
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
            Your Career Journey Starts Here
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white' }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Your Subscription
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Plan: {subscriptionStatus}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {subscriptionStatus === 'Premium'
                  ? 'Enjoy unlimited job applications and ZGPT access!'
                  : 'Upgrade to Premium for unlimited features.'}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, px: 4 }}
                onClick={() => history.push('/subscription')}
              >
                {subscriptionStatus === 'Premium' ? 'Manage Plan' : 'Upgrade Now'}
              </Button>
            </CardActions>
          </Card>
        </Box>

        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, px: 4, py: 1.5 }}
                onClick={() => history.push('/matches')}
              >
                Search Jobs
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, px: 4, py: 1.5 }}
                onClick={() => history.push('/zgpt')}
              >
                ZGPT Copilot
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, px: 4, py: 1.5 }}
                onClick={() => history.push('/dashboard')}
              >
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
            Your Job Matches
          </Typography>
          {loading ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          ) : error ? (
            <Typography sx={{ color: 'white', textAlign: 'center' }}>{error}</Typography>
          ) : jobs.length === 0 ? (
            <Typography sx={{ color: 'white', textAlign: 'center' }}>
              No matches yet. Search for jobs to find opportunities!
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {jobs.map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job._id}>
                  <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {job.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {job.company}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {job.location}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {job.salary ? `$${job.salary.toLocaleString()}` : 'Salary not disclosed'}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                        onClick={() => handleApply(job._id)}
                      >
                        Apply Now
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ color: 'white', borderColor: 'white' }}
                        onClick={() => history.push(`/job/${job._id}`)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box sx={{ py: 6, mt: 8, backgroundColor: '#1a2a44', borderRadius: '15px' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  ZvertexAI
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Empowering careers with AI-driven solutions.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Quick Links
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', mb: 1, cursor: 'pointer' }}
                  onClick={() => history.push('/why-zvertexai')}
                >
                  Why ZvertexAI?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', mb: 1, cursor: 'pointer' }}
                  onClick={() => history.push('/interview-faqs')}
                >
                  Interview FAQs
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'white', mb: 1, cursor: 'pointer' }}
                  onClick={() => history.push('/zgpt')}
                >
                  ZGPT Copilot
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Contact Us
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                  Address: 5900 BALCONES DR #16790 AUSTIN, TX 78731
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                  Phone: 737-239-0920
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => history.push('/contact-us')}
                >
                  Reach Out
                </Button>
              </Grid>
            </Grid>
            <Typography variant="body2" align="center" sx={{ color: 'white', mt: 4 }}>
              © 2025 ZvertexAI. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;