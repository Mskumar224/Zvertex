import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Typography, Button, Container, CircularProgress, TextField, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';

function JobDetails({ user }) {
  const { jobId } = useParams();
  const history = useHistory();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/${jobId}`);
        setJob(res.data.job);
        setLoading(false);
      } catch (err) {
        setError('Failed to load job details.');
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

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

      await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/apply`,
        formData,
        { headers: { 'x-auth-token': localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' } }
      );
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Application failed.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#ff6d00' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
        <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>ZvertexAI</Typography>
            <Box>
              <Button color="inherit" onClick={handleServicesClick} endIcon={<ArrowDropDownIcon />}>Services</Button>
              <Menu anchorEl={servicesAnchor} open={Boolean(servicesAnchor)} onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}>
                <MenuItem onClick={() => { handleClose(); history.push('/faq'); }}>Interview FAQs</MenuItem>
                <MenuItem onClick={() => { handleClose(); history.push('/why-us'); }}>Why ZvertexAI?</MenuItem>
                <MenuItem onClick={() => { handleClose(); history.push('/zgpt'); }}>ZGPT - Your Copilot</MenuItem>
              </Menu>
              <Button color="inherit" onClick={handleProjectsClick} endIcon={<ArrowDropDownIcon />}>JOIN OUR PROJECTS</Button>
              <Menu anchorEl={projectsAnchor} open={Boolean(projectsAnchor)} onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}>
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
                <Button color="inherit" onClick={() => { localStorage.removeItem('token'); history.push('/'); }}>Logout</Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ pt: 8, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button variant="outlined" sx={{ mt: 2, color: 'white', borderColor: 'white' }} onClick={() => history.goBack()}>Back</Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>ZvertexAI</Typography>
          <Box>
            <Button color="inherit" onClick={handleServicesClick} endIcon={<ArrowDropDownIcon />}>Services</Button>
            <Menu anchorEl={servicesAnchor} open={Boolean(servicesAnchor)} onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}>
              <MenuItem onClick={() => { handleClose(); history.push('/faq'); }}>Interview FAQs</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/why-us'); }}>Why ZvertexAI?</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/zgpt'); }}>ZGPT - Your Copilot</MenuItem>
            </Menu>
            <Button color="inherit" onClick={handleProjectsClick} endIcon={<ArrowDropDownIcon />}>JOIN OUR PROJECTS</Button>
            <Menu anchorEl={projectsAnchor} open={Boolean(projectsAnchor)} onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}>
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
              <Button color="inherit" onClick={() => { localStorage.removeItem('token'); history.push('/'); }}>Logout</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8 }}>
        <Button variant="outlined" sx={{ mb: 2, color: 'white', borderColor: 'white' }} onClick={() => history.goBack()} startIcon={<ArrowBackIcon />}>Back</Button>
        {job && (
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>{job.title}</Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>{job.company} - {job.location || 'N/A'}</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>{job.description}</Typography>
            {!user ? (
              <Button variant="contained" sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }} onClick={() => history.push('/register')}>
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
                <Button variant="contained" sx={{ backgroundColor: '#00e676', '&:hover': { backgroundColor: '#00c853' } }} onClick={handleApply}>
                  Submit Application
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default JobDetails;