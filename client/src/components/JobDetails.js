import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Container,
  TextField,
  CircularProgress,
  Grid,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function JobDetails({ user, setUser }) {
  const { jobId } = useParams();
  const history = useHistory();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}`);
        setJob(res.data.job);
        setLoading(false);
      } catch (err) {
        setError('Failed to load job details.');
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  const handleApply = async () => {
    if (!resume) {
      setError('Please upload a resume.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('jobId', jobId);
      formData.append('jobTitle', job.title);
      formData.append('company', job.company);

      await axios.post(`${process.env.REACT_APP_API_URL}/api/jobs/apply`, formData, {
        headers: { 'x-auth-token': localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' },
      });
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Application failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
        <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>
              ZvertexAI
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress sx={{ color: '#ff6d00' }} />
        </Box>
      </Box>
    );
  }

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
              Join Our Projects
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
            {user ? (
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
                <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Button
          variant="outlined"
          sx={{ mb: 2, color: 'white', borderColor: 'white' }}
          onClick={() => history.goBack()}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          job && (
            <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 4, boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                {job.title}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {job.company} - {job.location || 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {job.description}
              </Typography>
              {!user ? (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px' }}
                  onClick={() => history.push('/register')}
                >
                  Register to Apply
                </Button>
              ) : (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Apply Now</Typography>
                  <TextField
                    type="file"
                    fullWidth
                    inputProps={{ accept: '.pdf,.doc,.docx' }}
                    onChange={(e) => setResume(e.target.files[0])}
                    sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                  {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#00e676', '&:hover': { backgroundColor: '#00c853' }, borderRadius: '25px' }}
                    onClick={handleApply}
                  >
                    Submit Application
                  </Button>
                </Box>
              )}
            </Box>
          )
        )}
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

export default JobDetails;