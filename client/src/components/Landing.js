import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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

function Landing({ user }) {
  const history = useHistory();
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [searchError, setSearchError] = useState('');

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
          { technology: jobTitle, location }
        );
        setJobs(res.data.jobs || []);
        setSearchError('');
      } catch (err) {
        setSearchError('Failed to fetch jobs. Try again later.');
        setJobs([]);
      }
    } else {
      setSearchError('Please enter both Job Title and Location.');
    }
  };

  const handleJobClick = (jobId) => {
    if (!user) {
      history.push(`/job/${jobId}`);
    } else {
      history.push('/dashboard');
    }
  };

  const handleGetStarted = () => {
    if (user) {
      history.push('/dashboard');
    } else {
      history.push('/register');
    }
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
              <MenuItem onClick={() => { handleClose(); history.push('/faq'); }}>Interview FAQs</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/why-us'); }}>Why ZvertexAI?</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/zgpt'); }}>ZGPT - Your Copilot</MenuItem>
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
              <MenuItem onClick={() => { handleClose(); history.push(user ? '/projects/saas' : '/register'); }}>SaaS Solutions</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push(user ? '/projects/cloud' : '/register'); }}>Cloud Migration</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push(user ? '/projects/ai' : '/register'); }}>AI Automation</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push(user ? '/projects/bigdata' : '/register'); }}>Big Data Analytics</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push(user ? '/projects/devops' : '/register'); }}>DevOps Integration</MenuItem>
            </Menu>
            {!user && (
              <>
                <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
                <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
              </>
            )}
            {user && (
              <Button
                color="inherit"
                onClick={() => {
                  localStorage.removeItem('token');
                  history.push('/');
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
              Drop Your Resume, We’ll Find Your Job
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Your only worry should be acing the final interview. Unleash the full power of ZGPT!
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px', px: 4, py: 1.5 }}
              onClick={handleGetStarted}
            >
              {user ? 'Go to Dashboard' : 'Get Started Now'}
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 3, boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>Search Your Dream Job Here</Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>Discover your next opportunity with AI-driven tools.</Typography>
              <TextField
                label="Enter Job Title, Skills"
                fullWidth
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
              />
              <TextField
                label="Enter Location (Zip, City, State)"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{ mb: 3, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px', py: 1.5 }}
                onClick={handleSearch}
              >
                Find Jobs
              </Button>
              {searchError && <Typography color="error" sx={{ mt: 2 }}>{searchError}</Typography>}
              {jobs.length > 0 ? (
                <Box sx={{ mt: 3, maxHeight: '300px', overflowY: 'auto' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Job Results</Typography>
                  <List>
                    {jobs.map((job) => (
                      <ListItem
                        key={job.id}
                        button
                        onClick={() => handleJobClick(job.id)}
                        sx={{ backgroundColor: 'rgba(255,255,255,0.05)', mb: 1, borderRadius: '10px', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                      >
                        <ListItemText
                          primary={job.title}
                          secondary={`${job.company} - ${job.location || 'N/A'}`}
                          primaryTypographyProps={{ color: 'white' }}
                          secondaryTypographyProps={{ color: '#b0b0b0' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                !searchError && (
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 2, color: '#b0b0b0' }}>
                      No jobs found. Enter a job title and location above to start searching.
                    </Typography>
                    <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} onClick={() => { setJobTitle(''); setLocation(''); }}>
                      Clear Search
                    </Button>
                  </Box>
                )
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>Why Choose ZvertexAI?</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, cursor: 'pointer' }}
                onClick={() => history.push(user ? '/projects/ai' : '/register')}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>AI Job Matching</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Leverage our AI to analyze your resume and match you with top jobs. Subscribe for unlimited applications!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, cursor: 'pointer' }}
                onClick={() => history.push(user ? '/projects/saas' : '/register')}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>In-house AI Projects</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Collaborate on cutting-edge AI, Cloud, and SaaS projects. Join us—subscribe to get started!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{ backgroundColor: '#212121', color: 'white', borderRadius: '15px', height: '100%', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>ZGPT Copilot</Typography>
                  <Box sx={{ backgroundColor: '#303030', p: 2, borderRadius: '10px', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>You: "What’s the future of AI?"</Typography>
                    <Typography variant="body2" sx={{ color: '#00e676', mt: 1 }}>ZGPT: "AI will revolutionize jobs—subscribe to see how!"</Typography>
                  </Box>
                  <TextField
                    placeholder="Try me..."
                    fullWidth
                    disabled
                    sx={{ mb: 2, input: { color: 'white' }, '& .MuiInputBase-root': { backgroundColor: '#424242', borderRadius: '20px' }, '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                  />
                  <Button variant="contained" sx={{ backgroundColor: '#00e676', '&:hover': { backgroundColor: '#00c853' } }} onClick={() => history.push('/zgpt')}>
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
              <Typography variant="body2">Empowering careers with AI-driven job matching, projects, and ZGPT copilot.</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/faq')}>Interview FAQs</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/why-us')}>Why ZvertexAI?</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/zgpt')}>ZGPT Copilot</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Address: 5900 BALCONES DR #16790, AUSTIN, TX 78731</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Phone: 737-239-0920</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/contact')}>Email Us</Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>© 2025 ZvertexAI. All rights reserved.</Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;