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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function Dashboard({ user }) {
  const history = useHistory();
  const [resume, setResume] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/applied`,
          {
            headers: { 'x-auth-token': localStorage.getItem('token') },
          }
        );
        setAppliedJobs(res.data.jobs || []);
      } catch (err) {
        setError('Failed to load applied jobs.');
      }
    };
    if (user) fetchAppliedJobs();
  }, [user]);

  if (!user) {
    history.push('/login');
    return null;
  }

  const handleResumeUpload = async () => {
    if (!resume) {
      setError('Please select a resume.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com'}/api/auth/resume`,
        formData,
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setError('');
      alert('Resume uploaded successfully!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Resume upload failed.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Welcome, {user.email}!
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Subscription: {user.subscriptionType || 'Free'}
        </Typography>

        {/* Performance Summary Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Performance Summary
          </Typography>
          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '10px', p: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Application Processing
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      Job Submission -{' '}
                      <a
                        href="#"
                        style={{ color: '#ff6d00', textDecoration: 'none' }}
                        onClick={(e) => {
                          e.preventDefault();
                          alert('View script: job_submission.js');
                        }}
                      >
                        job_submission.js
                      </a>
                    </>
                  }
                  secondary="Origin: zvertexai.com"
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: '#b0b0b0' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      Resume Parser -{' '}
                      <a
                        href="#"
                        style={{ color: '#ff6d00', textDecoration: 'none' }}
                        onClick={(e) => {
                          e.preventDefault();
                          alert('View script: resume_parser.js');
                        }}
                      >
                        resume_parser.js
                      </a>
                    </>
                  }
                  secondary="Origin: api.zvertexai.com"
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: '#b0b0b0' }}
                />
              </ListItem>
            </List>
          </Box>
        </Box>

        {/* Resume Upload Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Upload Your Resume
          </Typography>
          <TextField
            type="file"
            fullWidth
            inputProps={{ accept: '.pdf,.doc,.docx' }}
            onChange={(e) => setResume(e.target.files[0])}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
            onClick={handleResumeUpload}
          >
            Upload Resume
          </Button>
        </Box>

        {/* Applied Jobs Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your Applied Jobs
          </Typography>
          {appliedJobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3, backgroundColor: '#1e1e1e', borderRadius: '10px' }}>
              <Typography variant="body1" sx={{ mb: 2, color: '#b0b0b0' }}>
                You haven’t applied to any jobs yet. Search for jobs on the home page or upload a resume to get started.
              </Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                onClick={() => history.push('/')}
              >
                Search Jobs
              </Button>
            </Box>
          ) : (
            <List>
              {appliedJobs.map((job) => (
                <ListItem key={job.jobId}>
                  <ListItemText
                    primary={job.jobTitle}
                    secondary={`${job.company} - Applied on ${new Date(job.date).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Accessibility Tree View Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Accessibility Tree View
          </Typography>
          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '10px', p: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Inspect how assistive technologies interpret your job application form.
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Form: Job Application"
                  secondary="Role: form, Label: Apply for Job"
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: '#b0b0b0' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Input: Resume Upload"
                  secondary="Role: fileinput, Label: Upload Resume"
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: '#b0b0b0' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Button: Submit Application"
                  secondary="Role: button, Label: Submit"
                  primaryTypographyProps={{ color: 'white' }}
                  secondaryTypographyProps={{ color: '#b0b0b0' }}
                />
              </ListItem>
            </List>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={() => history.push('/zgpt')}
          sx={{ mr: 2, backgroundColor: '#00e676' }}
        >
          Chat with ZGPT
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            localStorage.removeItem('token');
            history.push('/');
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}

export default Dashboard;