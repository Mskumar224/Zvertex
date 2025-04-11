import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Typography, Button, Container, CircularProgress, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function JobDetails({ user }) {
  const { jobId } = useParams();
  const history = useHistory();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com'}/api/jobs/${jobId}`
        );
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
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Application failed.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()} sx={{ mt: 2 }}>
            Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => history.goBack()} sx={{ mb: 2 }}>
          Back
        </Button>
        {job && (
          <Box sx={{ backgroundColor: '#1e1e1e', borderRadius: '15px', p: 4, color: 'white' }}>
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
                sx={{
                  backgroundColor: '#ff6d00',
                  '&:hover': { backgroundColor: '#e65100' },
                }}
                onClick={() => history.push('/register')}
              >
                Register to Apply
              </Button>
            ) : (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Apply Now
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
                  sx={{
                    backgroundColor: '#00e676',
                    '&:hover': { backgroundColor: '#00c853' },
                  }}
                  onClick={handleApply}
                >
                  Submit Application
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default JobDetails;