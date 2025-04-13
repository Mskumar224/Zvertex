import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, Typography, Button, AppBar, Toolbar, Menu, MenuItem,
  Container, Grid, Card, CardContent, TextField, IconButton,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

function Landing({ user }) {
  const history = useHistory();
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

  const handleSearch = async () => {
    if (jobTitle.trim() && location.trim()) {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/fetch`,
          { technology: jobTitle, location },
          { headers: { 'x-auth-token': localStorage.getItem('token') || '' } }
        );
        setJobs(res.data.jobs);
      } catch (err) {
        alert('Error fetching jobs. Please try again.');
      }
    } else {
      alert('Please enter both Job Title and Location.');
    }
  };

  const handleJobClick = (job) => {
    if (!user) {
      history.push('/register');
    } else {
      history.push('/dashboard'); // Redirect to dashboard for job details
    }
  };

  const handleGetStarted = () => {
    history.push(user ? '/dashboard' : '/register');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>
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
              <MenuItem onClick={() => { handleClose(); history.push('/interview-faqs'); }}>
                Interview FAQs
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/why-zvertexai'); }}>
                Why ZvertexAI?
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/zgpt'); }}>
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
              <MenuItem onClick={() => { handleClose(); history.push('/projects/saas'); }}>
                SaaS Solutions
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/cloud'); }}>
                Cloud Migration
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/ai'); }}>
                AI Automation
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/bigdata'); }}>
                Big Data Analytics
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/devops'); }}>
                DevOps Integration
              </MenuItem>
            </Menu>
            {!user && (
              <>
                <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
                <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
              </>
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
              AI-powered job applications, projects, and your copilot ZGPT.
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
              onClick={handleGetStarted}
            >
              Get Started Now
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              p: 3,
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            }}>
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
                onClick={handleSearch}
              >
                Find Jobs
              </Button>
              {jobs.length > 0 && (
                <Box sx={{ mt: 2, maxHeight: '200px', overflowY: 'auto' }}>
                  {jobs.map((job) => (
                    <Card
                      key={job.id}
                      sx={{ mb: 1, cursor: 'pointer', backgroundColor: '#2e4b7a' }}
                      onClick={() => handleJobClick(job)}
                    >
                      <CardContent>
                        <Typography variant="body1">{job.title}</Typography>
                        <Typography variant="body2">{job.company}</Typography>
                      </CardContent>
                    </Card>
                  ))}
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
              <Card sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '15px',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
                cursor: 'pointer',
              }}
              onClick={() => history.push(user ? '/ai-job-matching' : '/register')}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>AI Job Matching</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Leverage our AI to analyze your resume and auto-apply to tailored job listings. Subscribe for unlimited applications and real-time job matching!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '15px',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
                cursor: 'pointer',
              }}
              onClick={() => history.push(user ? '/ai-projects' : '/register')}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>In-house AI Projects</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Contribute to cutting-edge AI, Cloud, and SaaS projects. Join our ecosystem to build the future—subscribe to get started!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{
                backgroundColor: '#212121',
                color: 'white',
                borderRadius: '15px',
                height: '100%',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    ZGPT Copilot
                  </Typography>
                  <Box sx={{ backgroundColor: '#303030', p: 2, borderRadius: '10px', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      You: "What’s the future of AI?"
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#00e676', mt: 1 }}>
                      ZGPT: "AI will revolutionize jobs—subscribe to see how!"
                    </Typography>
                  </Box>
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
                    onClick={() => history.push('/zgpt')}
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
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>ZvertexAI</Typography>
              <Typography variant="body2">
                Empowering careers with AI-driven job matching, projects, and ZGPT copilot.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-zvertexai')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/interview-faqs')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: 5900 BALCONES DR #16790 AUSTIN, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
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
          <Typography variant="body2" align="center" sx={{ mt: 4 }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;