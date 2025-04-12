import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Container, CircularProgress, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Dashboard({ user, apiUrl }) {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/login');
    }
  }, [user, history]);

  const handleSearch = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${apiUrl}/api/job`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        params: { query: searchTerm, subscriptionType: user.subscriptionType },
      });
      setJobs(res.data.results || []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      color: 'white',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Job Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <TextField
              label="Search Jobs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: '#00e676' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                px: 4,
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <Card
                  key={index}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)' },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#00e676' }}>
                      {job.title || 'No Title'}
                    </Typography>
                    <Typography sx={{ color: 'white', opacity: 0.9 }}>
                      {job.company?.display_name || 'Unknown Company'}
                    </Typography>
                    <Typography sx={{ color: 'white', opacity: 0.7 }}>
                      {job.location?.display_name || 'Remote'}
                    </Typography>
                    <Button
                      href={job.redirect_url || '#'}
                      target="_blank"
                      sx={{
                        mt: 2,
                        color: '#ff6d00',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography sx={{ color: 'white', textAlign: 'center' }}>
                No jobs found. Try a different search.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;