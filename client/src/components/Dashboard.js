import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from 'axios';

function Dashboard({ user }) {
  const history = useHistory();
  const [resume, setResume] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  useEffect(() => {
    const fetchAppliedJobs = async (retryCount = 3, delay = 1000) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token missing. Please log in again.');
          history.push('/login');
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/jobs/applied`, {
          headers: { 'x-auth-token': token }
        });
        setAppliedJobs(res.data.jobs || []);
        setError('');
      } catch (err) {
        console.error('Failed to fetch applied jobs:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        if (err.response?.status === 404 && retryCount > 0) {
          console.log(`Retrying /api/jobs/applied (${retryCount} attempts left)...`);
          setTimeout(() => fetchAppliedJobs(retryCount - 1, delay * 2), delay);
        } else if (err.response?.status === 404) {
          setError('Server missing jobs endpoint. Try refreshing the page or contact support.');
        } else if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
          history.push('/login');
        } else {
          setError(err.response?.data?.msg || 'Failed to load applied jobs.');
        }
      }
    };
    if (user) fetchAppliedJobs();
  }, [user, history]);

  if (!user) {
    history.push('/login');
    return null;
  }

  const handleResumeUpload = async () => {
    if (!resume) {
      setError('Please select a resume file (PDF, DOC, or DOCX).');
      return;
    }
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(resume.type)) {
      setError('Please upload a valid file (PDF, DOC, or DOCX).');
      return;
    }
    if (resume.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        history.push('/login');
        return;
      }

      const formData = new FormData();
      formData.append('resume', resume);

      const res = await axios.post(`${API_BASE_URL}/api/auth/resume`, formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
      });
      setError('');
      alert(res.data.msg || 'Resume uploaded successfully!');
      setResume(null);
      document.getElementById('resume-upload').value = ''; // Reset file input
    } catch (err) {
      console.error('Resume upload failed:', err.response?.data || err.message);
      const serverMsg = err.response?.data?.msg || 'Failed to upload resume. Please check your file and try again.';
      if (err.response?.status === 404) {
        setError('Resume upload endpoint not found. Please contact support.');
      } else if (err.response?.status === 405) {
        setError('Invalid request method. Please use the upload button.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        history.push('/login');
      } else {
        setError(serverMsg);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setError('');
    setResume(null);
    document.getElementById('resume-upload').value = ''; // Reset file input
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>
            ZvertexAI
          </Typography>
          <Box>
            <Button color="inherit" onClick={handleServicesClick} endIcon={<ArrowDropDownIcon />}>Services</Button>
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
            <Button color="inherit" onClick={handleProjectsClick} endIcon={<ArrowDropDownIcon />}>JOIN OUR PROJECTS</Button>
            <Menu
              anchorEl={projectsAnchor}
              open={Boolean(projectsAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}
            >
              <MenuItem onClick={() => { handleClose(); history.push('/projects/saas'); }}>SaaS Solutions</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/cloud'); }}>Cloud Migration</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/ai'); }}>AI Automation</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/bigdata'); }}>Big Data Analytics</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/devops'); }}>DevOps Integration</MenuItem>
            </Menu>
            <Button
              color="inherit"
              onClick={() => {
                localStorage.removeItem('token');
                history.push('/');
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Welcome, {user.email}!</Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>Subscription: {user.subscriptionType || 'Free'}</Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Performance Summary</Typography>
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', p: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>Application Processing</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary={<>Job Submission - <a href="#" style={{ color: '#ff6d00', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); alert('View script: job_submission.js'); }}>job_submission.js</a></>}
                  secondary="Origin: zvertexai.com"
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: '#b0b0b0' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<>Resume Parser - <a href="#" style={{ color: '#ff6d00', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); alert('View script: resume_parser.js'); }}>resume_parser.js</a></>}
                  secondary="Origin: api.zvertexai.com"
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: '#b0b0b0' }}
                />
              </ListItem>
            </List>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Upload Your Resume</Typography>
          <TextField
            id="resume-upload"
            type="file"
            fullWidth
            inputProps={{ accept: '.pdf,.doc,.docx' }}
            onChange={(e) => setResume(e.target.files[0])}
            sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
          />
          {error && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error">{error}</Typography>
              <Button
                variant="outlined"
                sx={{ mt: 1, mr: 1, color: 'white', borderColor: 'white' }}
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                variant="outlined"
                sx={{ mt: 1, color: 'white', borderColor: 'white' }}
                onClick={handleClear}
              >
                Retry
              </Button>
            </Box>
          )}
          <Button
            variant="contained"
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
            onClick={handleResumeUpload}
            disabled={uploading}
            startIcon={uploading && <CircularProgress size={20} />}
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Your Applied Jobs</Typography>
          {appliedJobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <Typography variant="body1" sx={{ mb: 2, color: '#b0b0b0' }}>
                You haven’t applied to any jobs yet. Search for jobs on the home page or upload a resume to get started.
              </Typography>
              <Button variant="contained" sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }} onClick={() => history.push('/')}>
                Search Jobs
              </Button>
            </Box>
          ) : (
            <List>
              {appliedJobs.map((job) => (
                <ListItem key={job.jobId}>
                  <ListItemText primary={job.jobTitle} secondary={`${job.company} - Applied on ${new Date(job.date).toLocaleDateString()}`} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Accessibility Tree View</Typography>
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', p: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>Inspect how assistive technologies interpret your job application form.</Typography>
            <List>
              <ListItem><ListItemText primary="Form: Job Application" secondary="Role: form, Label: Apply for Job" primaryTypographyProps={{ color: 'white' }} secondaryTypographyProps={{ color: '#b0b0b0' }} /></ListItem>
              <ListItem><ListItemText primary="Input: Resume Upload" secondary="Role: fileinput, Label: Upload Resume" primaryTypographyProps={{ color: 'white' }} secondaryTypographyProps={{ color: '#b0b0b0' }} /></ListItem>
              <ListItem><ListItemText primary="Button: Submit Application" secondary="Role: button, Label: Submit" primaryTypographyProps={{ color: 'white' }} secondaryTypographyProps={{ color: '#b0b0b0' }} /></ListItem>
            </List>
          </Box>
        </Box>

        <Button variant="contained" onClick={() => history.push('/zgpt')} sx={{ mr: 2, backgroundColor: '#00e676' }}>Chat with ZGPT</Button>
        <Button variant="outlined" onClick={() => { localStorage.removeItem('token'); history.push('/'); }}>Logout</Button>
      </Container>
    </Box>
  );
}

export default Dashboard;