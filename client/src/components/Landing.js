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
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';

function Landing({ user, setUser }) {
  const history = useHistory();
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);
  const [technology, setTechnology] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/jobs/search`, { technology, location });
      setJobs(res.data.jobs);
      setError('');
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      setJobs([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', color: '#ffffff' }}
            onClick={() => history.push('/')}
          >
            ZvertexAI
          </Typography>
          <Box>
            <Button
              sx={{ color: '#ffffff' }}
              onClick={handleServicesClick}
              endIcon={<ArrowDropDownIcon sx={{ color: '#ffffff' }} />}
            >
              Services
            </Button>
            <Menu
              anchorEl={servicesAnchor}
              open={Boolean(servicesAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: '#ffffff' } }}
            >
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/faq'); }}>
                Interview FAQs
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/why-us'); }}>
                Why ZvertexAI?
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/zgpt'); }}>
                ZGPT - Your Copilot
              </MenuItem>
            </Menu>
            <Button
              sx={{ color: '#ffffff' }}
              onClick={handleProjectsClick}
              endIcon={<ArrowDropDownIcon sx={{ color: '#ffffff' }} />}
            >
              Join Our Projects
            </Button>
            <Menu
              anchorEl={projectsAnchor}
              open={Boolean(projectsAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: '#ffffff' } }}
            >
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push(user ? '/projects/saas' : '/register'); }}>
                SaaS Solutions
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push(user ? '/projects/cloud' : '/register'); }}>
                Cloud Migration
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push(user ? '/projects/ai' : '/register'); }}>
                AI Automation
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push(user ? '/projects/bigdata' : '/register'); }}>
                Big Data Analytics
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push(user ? '/projects/devops' : '/register'); }}>
                DevOps Integration
              </MenuItem>
            </Menu>
            {user ? (
              <Button sx={{ color: '#ffffff' }} onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button sx={{ color: '#ffffff' }} onClick={() => history.push('/login')}>
                  Login
                </Button>
                <Button sx={{ color: '#ffffff' }} onClick={() => history.push('/register')}>
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          Find Your Dream Job with ZvertexAI
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: '#b0b0b0' }}>
          AI-driven job matching, career advice, and cutting-edge projects.
        </Typography>

        <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 4, boxShadow: '0 8px 20px rgba(0,0,0,0.3)', mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Search Jobs
          </Typography>
          <form onSubmit={handleSearch}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Technology"
                  fullWidth
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Location"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px', height: '100%' }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          {jobs.length > 0 && (
            <Box sx={{ mt: 3 }}>
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}
                  onClick={() => history.push(`/job/${job.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>{job.company} - {job.location}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, cursor: 'pointer' }}
              onClick={() => history.push(user ? '/dashboard' : '/register')}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>AI Job Matching</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Upload your resume and let our AI find the best jobs for you. Subscribe for unlimited applications!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' }, cursor: 'pointer' }}
              onClick={() => history.push(user ? '/projects/saas' : '/register')}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Cutting-Edge Projects</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Work on innovative AI, Cloud, and SaaS projects. Join us—subscribe to get started!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ZGPT Copilot Section */}
        <Box
          sx={{
            mt: 8,
            py: 6,
            background: 'linear-gradient(180deg, #1a2a44 0%, #2e4b7a 100%)',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeIn 1s ease-in-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 20% 20%, rgba(255,109,0,0.15), transparent 60%)',
              zIndex: 0,
            }}
          />
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                textAlign: 'center',
                color: '#ffffff',
                textShadow: '0 0 10px rgba(255,109,0,0.5)',
              }}
            >
              ZGPT Copilot
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                textAlign: 'center',
                color: '#d0d0d0',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Get personalized career advice and job insights with our AI-powered ZGPT.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '30px',
                p: 1,
                maxWidth: '700px',
                mx: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: '0 6px 30px rgba(0,0,0,0.4)',
                },
              }}
            >
              <TextField
                placeholder="Ask ZGPT about your career..."
                disabled
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    color: '#b0b0b0',
                    fontStyle: 'italic',
                  },
                  '& .MuiInputBase-input': {
                    py: 1.5,
                    px: 2,
                  },
                  '& fieldset': { border: 'none' },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#ff6d00',
                  borderRadius: '25px',
                  px: 4,
                  py: 1.5,
                  ml: 1,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 0 10px rgba(255,109,0,0.5)',
                  animation: 'pulse 2s infinite',
                  '&:hover': {
                    backgroundColor: '#e65100',
                    boxShadow: '0 0 15px rgba(255,109,0,0.7)',
                  },
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(255,109,0,0.7)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(255,109,0,0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(255,109,0,0)' },
                  },
                }}
                onClick={() => history.push('/zgpt')}
              >
                Try ZGPT Now
              </Button>
            </Box>
          </Container>
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
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/why-us')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Address: 5900 BALCONES DR #16790, AUSTIN, TX 78731</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Phone: 737-239-0920</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/contact')}>
                Email Us
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>© 2025 ZvertexAI. All rights reserved.</Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;