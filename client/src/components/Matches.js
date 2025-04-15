import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import axios from 'axios';

function Matches({ user }) {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const fetchJobs = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${apiUrl}/api/jobs`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        params: { search: query },
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchQuery);
  };

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
            Job Matches
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
            Find Your Perfect Job
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Search for jobs tailored to your skills and preferences with ZvertexAI's intelligent matching.
          </Typography>
        </Box>
        <Box sx={{ maxWidth: '600px', mx: 'auto', mb: 6 }}>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: '15px' }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={9}>
                <TextField
                  placeholder="Search jobs (e.g., Software Engineer, Remote)"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    input: { color: 'white' },
                    '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                </Button>
              </Grid>
            </Grid>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </Box>
        <Box sx={{ mb: 6 }}>
          {loading ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          ) : jobs.length === 0 ? (
            <Typography sx={{ color: 'white', textAlign: 'center' }}>
              No jobs found. Try adjusting your search.
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {jobs.map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job._id}>
                  <Card
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '15px',
                      color: 'white',
                    }}
                  >
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
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {job.type} • {job.experienceLevel}
                      </Typography>
                    </CardContent>
                    <CardActions>
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

export default Matches;