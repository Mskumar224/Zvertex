import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';

function Landing({ user, setUser }) {
  const navigate = useNavigate();
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  const handleJobSearch = async () => {
    if (jobTitle.trim() && location.trim()) {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5002'}/api/jobs/fetch`,
          { technology: jobTitle, location }
        );
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error('Job Search Error:', err);
        setJobs([]);
      }
    } else {
      alert('Please enter both Job Title and Location.');
    }
  };

  const handleJobClick = (job) => {
    if (!user) {
      navigate('/register');
    } else {
      navigate('/dashboard');
    }
  };

  const handleAIJobMatchingClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleAIProjectsClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
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
          <Box>
            <Button color="inherit" onClick={handleServicesClick} endIcon={<ArrowDropDownIcon />}>
              Services
            </Button>
            <Menu
              anchorEl={servicesAnchor}
              open={Boolean(servicesAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/zgpt');
                }}
              >
                ZGPT - Your Copilot
              </MenuItem>
            </Menu>
            <Button color="inherit" onClick={handleProjectsClick} endIcon={<ArrowDropDownIcon />}>
              JOIN OUR PROJECTS
            </Button>
            <Menu
              anchorEl={projectsAnchor}
              open={Boolean(projectsAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/dashboard');
                }}
              >
                AI Automation
              </MenuItem>
            </Menu>
            {!user && (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
            {user && (
              <Button
                color="inherit"
                onClick={() => {
                  localStorage.removeItem('token');
                  setUser(null);
                  navigate('/');
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Elevate Your Career with ZvertexAI
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              AI-powered job applications and your copilot ZGPT.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                px: 4,
                py: 1.5,
              }}
              onClick={() => navigate(user ? '/dashboard' : '/register')}
            >
              {user ? 'Go to Dashboard' : 'Get Started Now'}
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
                p: 3,
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Search Your Dream Job Here
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Discover your next opportunity with AI-driven tools.
              </Typography>
              <TextField
                label="Enter Job Title, Skills"
                fullWidth
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                sx={{
                  mb: 2,
                  input: { color: 'white' },
                  label: { color: 'white' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                }}
              />
              <TextField
                label="Enter Location (Zip, City, State)"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{
                  mb: 3,
                  input: { color: 'white' },
                  label: { color: 'white' },
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#ff6d00',
                  '&:hover': { backgroundColor: '#e65100' },
                  borderRadius: '25px',
                  py: 1.5,
                }}
                onClick={handleJobSearch}
              >
                Find Jobs
              </Button>
              {jobs.length > 0 && (
                <Box sx={{ mt: 2, maxHeight: '200px', overflowY: 'auto' }}>
                  <List>
                    {jobs.map((job) => (
                      <ListItem
                        key={job.id}
                        button
                        onClick={() => handleJobClick(job)}
                        sx={{
                          backgroundColor: '#2e4b7a',
                          mb: 1,
                          borderRadius: '10px',
                          '&:hover': { backgroundColor: '#ff6d00' },
                        }}
                      >
                        <ListItemText primary={job.title} secondary={job.company} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            Why Choose ZvertexAI?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderRadius: '15px',
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                  cursor: 'pointer',
                }}
                onClick={handleAIJobMatchingClick}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    AI Job Matching
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Leverage our advanced AI to match you with top-tier job opportunities.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: '#ff6d00',
                      '&:hover': { backgroundColor: '#e65100' },
                    }}
                    onClick={handleAIJobMatchingClick}
                  >
                    {user ? 'Explore Jobs' : 'Subscribe Now'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  backgroundColor: '#212121',
                  color: 'white',
                  borderRadius: '15px',
                  height: '100%',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    ZGPT Copilot
                  </Typography>
                  <TextField
                    placeholder="Try me..."
                    fullWidth
                    disabled
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      '& .MuiInputBase-root': { backgroundColor: '#424242', borderRadius: '20px' },
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#00e676', '&:hover': { backgroundColor: '#00c853' } }}
                    onClick={() => navigate('/zgpt')}
                  >
                    Chat with ZGPT
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;