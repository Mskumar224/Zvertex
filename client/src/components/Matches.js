import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import AutoApplyForm from './AutoApplyForm';

function Matches({ user }) {
  const history = useHistory();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applyJob, setApplyJob] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${apiUrl}/api/jobs`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        params: { search, location, job_type: jobType },
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
      const debounce = setTimeout(() => {
        fetchJobs();
      }, 500); // Debounce to prevent rapid API calls
      return () => clearTimeout(debounce);
    }
  }, [user, search, location, jobType]); // Fetch on each input change

  const handleApply = (job) => {
    setApplyJob(job);
  };

  const handleApplySubmit = (applicationUrl) => {
    setApplyJob(null);
    window.open(applicationUrl, '_blank');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            Job Matches
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
            Find Your Next Opportunity
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search Jobs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="full-time">Full-time</MenuItem>
                  <MenuItem value="part-time">Part-time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Box>
          {loading ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          ) : error ? (
            <Typography sx={{ color: 'white', textAlign: 'center' }}>{error}</Typography>
          ) : jobs.length === 0 ? (
            <Typography sx={{ color: 'white', textAlign: 'center' }}>
              No jobs found. Try adjusting your search.
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
                        {job.salary ? job.salary : 'Salary not disclosed'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Type: {job.type}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                        onClick={() => handleApply(job)}
                      >
                        Auto Apply
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

        {applyJob && (
          <AutoApplyForm
            open={!!applyJob}
            onClose={() => setApplyJob(null)}
            job={applyJob}
            onApply={handleApplySubmit}
          />
        )}

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