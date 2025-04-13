import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Button, Grid, TextField, CircularProgress, Alert } from '@mui/material';
import BackButton from './BackButton';
import axios from 'axios';

function Dashboard({ user, setUser }) {
  const history = useHistory();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(user.profile || { jobTitle: '', skills: [], location: '' });
  const [searchData, setSearchData] = useState({ jobTitle: '', skills: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    if (user.subscriptionStatus !== 'ACTIVE') {
      setError('Please subscribe to view jobs');
      setTimeout(() => history.push('/subscription'), 2000);
    } else {
      fetchJobs();
    }
  }, [user.subscriptionStatus, apiUrl, history]);

  const fetchJobs = async (searchParams = {}) => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/api/jobs`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        params: searchParams,
      });
      setJobs(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.put(
        `${apiUrl}/api/auth/profile`,
        { profile },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setUser({ ...user, profile: res.data.profile });
      setSuccess('Profile updated successfully');
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    const { jobTitle, skills, location } = searchData;
    if (!jobTitle || !skills || !location) {
      setError('All search fields are required');
      return;
    }
    fetchJobs({ jobTitle, skills: skills.split(',').map(s => s.trim()), location });
  };

  const handleAutoApply = async (jobId) => {
    try {
      setLoading(true);
      await axios.post(
        `${apiUrl}/api/jobs/apply`,
        { jobId },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setSuccess('Application submitted!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <BackButton />
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Dashboard
          </Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px', mb: 4 }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Edit Profile
          </Typography>
          <Box component="form" onSubmit={handleProfileUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  fullWidth
                  value={profile.jobTitle}
                  onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                  sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Skills (comma-separated)"
                  fullWidth
                  value={profile.skills.join(', ')}
                  onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(skill => skill.trim()) })}
                  sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Location (Zip, City, State)"
                  fullWidth
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {user.subscriptionStatus === 'ACTIVE' && (
          <>
            <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px', mb: 4 }}>
              <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                Search Your Dream Job Here
              </Typography>
              <Typography sx={{ color: 'white', mb: 2 }}>
                Discover your next opportunity with AI-driven tools.
              </Typography>
              <Box component="form" onSubmit={handleSearch}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Enter Job Title, Skills"
                      fullWidth
                      value={searchData.jobTitle}
                      onChange={(e) => setSearchData({ ...searchData, jobTitle: e.target.value })}
                      sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Enter Skills (comma-separated)"
                      fullWidth
                      value={searchData.skills}
                      onChange={(e) => setSearchData({ ...searchData, skills: e.target.value })}
                      sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Enter Location (Zip, City, State)"
                      fullWidth
                      value={searchData.location}
                      onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                      sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Search Jobs'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Recommended Jobs
            </Typography>
            {loading ? (
              <CircularProgress sx={{ color: 'white' }} />
            ) : (
              <Grid container spacing={2}>
                {jobs.map(job => (
                  <Grid item xs={12} sm={6} md={4} key={job._id}>
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: '10px' }}>
                      <Typography sx={{ color: 'white' }}>{job.title}</Typography>
                      <Typography sx={{ color: 'white' }}>{job.company}</Typography>
                      <Typography sx={{ color: 'white' }}>{job.location}</Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 1, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                        onClick={() => handleAutoApply(job._id)}
                      >
                        Apply
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;