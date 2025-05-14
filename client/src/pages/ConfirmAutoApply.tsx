import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, TextField, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConfirmAutoApply: React.FC = () => {
  const [jobs, setJobs] = useState<any>({});
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [requiresInfo, setRequiresInfo] = useState<{ linkedin: boolean; coverLetter: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const companies = JSON.parse(localStorage.getItem('selectedCompanies') || '[]');
        const res = await axios.post('https://zvertexai-orzv.onrender.com/api/select-companies', {
          token,
          companies,
        });
        setJobs(res.data.jobs);
      } catch (error: any) {
        console.error('Fetch jobs failed:', error.response?.data);
        setMessage('Failed to fetch real-time jobs: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://zvertexai-orzv.onrender.com/api/auto-apply', {
        token,
        linkedinProfile: linkedinProfile || undefined,
        coverLetter: coverLetter || undefined,
      });
      if (res.status === 400 && res.data.requires) {
        setRequiresInfo(res.data.requires);
      } else {
        setMessage('Auto-apply initiated successfully! Confirmation email sent.');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (error: any) {
      if (error.response?.status === 400 && error.response.data.requires) {
        setRequiresInfo(error.response.data.requires);
      } else {
        setMessage('Auto-apply failed: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleSubmitAdditionalInfo = async () => {
    try {
      await handleConfirm();
    } catch (error: any) {
      setMessage('Failed to submit additional info: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Confirm Auto-Apply</Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>Real-Time Jobs to Apply:</Typography>
      {loading ? (
        <Typography>Loading jobs...</Typography>
      ) : (
        <List>
          {Object.entries(jobs).length === 0 ? (
            <Typography>No jobs found matching your technology and selected companies.</Typography>
          ) : (
            Object.entries(jobs).flatMap(([company, jobList]: [string, any]) =>
              jobList.map((job: any) => (
                <ListItem key={job.id}>
                  <ListItemText
                    primary={job.title}
                    secondary={
                      <>
                        Company: {company} <br />
                        {job.requiresDocs ? 'Requires LinkedIn & Cover Letter' : 'Auto-Apply Ready'} 
                        <br /> Posted: {new Date(job.posted).toLocaleDateString()} 
                        <br /> <a href={job.url} target="_blank" rel="noopener noreferrer">Apply Link</a>
                      </>
                    }
                  />
                </ListItem>
              ))
            )
          )}
        </List>
      )}
      {requiresInfo && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Additional Information Required</Typography>
          {requiresInfo.linkedin && (
            <TextField
              label="LinkedIn Profile URL"
              value={linkedinProfile}
              onChange={(e) => setLinkedinProfile(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          )}
          {requiresInfo.coverLetter && (
            <TextField
              label="Cover Letter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />
          )}
          <Button
            variant="contained"
            onClick={handleSubmitAdditionalInfo}
            sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}
          >
            Submit & Apply
          </Button>
        </Box>
      )}
      {!requiresInfo && !loading && (
        <Button variant="contained" onClick={handleConfirm} sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}>
          Confirm & Apply
        </Button>
      )}
      <Button
        variant="outlined"
        onClick={() => navigate('/companies')}
        sx={{ mt: 2, px: 4, py: 1.5 }}
      >
        Back
      </Button>
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('failed') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default ConfirmAutoApply;