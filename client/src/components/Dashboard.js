import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL || 'http://localhost:5002'}/api/auth/user`, {
          headers: { 'x-auth-token': token },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5002'}/api/jobs/search`,
        {
          headers: { 'x-auth-token': token },
          params: { query, location },
        }
      );
      setJobs(res.data);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || 'Search failed'));
    }
  };

  const handleApply = async (job) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5002'}/api/jobs/apply`,
        {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company.display_name,
          jobUrl: job.redirect_url,
        },
        { headers: { 'x-auth-token': token } }
      );
      alert('Application submitted!');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || 'Application failed'));
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1a2a44', color: 'white' }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            ZvertexAI
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Welcome, {user.name}!
        </Typography>
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Job Title, Skills"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
        <List>
          {jobs.map((job) => (
            <ListItem
              key={job.id}
              sx={{
                backgroundColor: '#2e4b7a',
                mb: 1,
                borderRadius: '10px',
              }}
            >
              <ListItemText primary={job.title} secondary={job.company.display_name} />
              <Button
                variant="contained"
                sx={{ backgroundColor: '#00e676', '&:hover': { backgroundColor: '#00c853' } }}
                onClick={() => handleApply(job)}
              >
                Apply
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
}

export default Dashboard;