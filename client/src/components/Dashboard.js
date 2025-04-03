import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, 
  CircularProgress, Box, Paper, List, ListItem, ListItemText, Divider, Alert 
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ user }) {
  const history = useHistory();
  const [resume, setResume] = useState(null);
  const [technology, setTechnology] = useState('');
  const [manualTech, setManualTech] = useState('');
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userDetails, setUserDetails] = useState({ phone: '', email: user?.email || '' });
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  if (!user) {
    history.push('/');
    return null;
  }

  const companyList = [
    'Google', 'Microsoft', 'Amazon', 'Facebook', 'Apple', 'Tesla', 'IBM', 'Oracle', 'Intel', 'Cisco',
    'Netflix', 'Adobe', 'Salesforce', 'Twitter', 'LinkedIn', 'Uber', 'Airbnb', 'Spotify', 'Dropbox', 'Slack',
    'PayPal', 'Zoom', 'Atlassian', 'Shopify', 'Square', 'GitHub', 'GitLab', 'Red Hat', 'VMware', 'SAP',
    'Dell', 'HP', 'Nvidia', 'AMD', 'Qualcomm', 'Broadcom', 'ServiceNow', 'Workday', 'Snowflake', 'Datadog',
    'Twilio', 'MongoDB', 'Elastic', 'Splunk', 'Palo Alto Networks', 'Fortinet', 'CrowdStrike', 'Zscaler', 'Okta', 'Cloudflare'
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/auth/me`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setUserDetails({ phone: res.data.phone || '', email: res.data.email });
        if (res.data.resume) setResume(res.data.resume);
      } catch (err) {
        console.error('Fetch User Details Error:', err);
      }
    };
    fetchUserDetails();
  }, [apiUrl]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    setResume(file);
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await axios.post(`${apiUrl}/api/auth/upload-resume`, formData, {
        headers: { 'x-auth-token': localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' },
      });
      const tech = res.data.technology;
      setTechnology(tech || '');
      setMessage(tech ? `Detected technology: ${tech}` : 'Could not detect technology. Please enter manually.');
    } catch (err) {
      console.error('Resume Upload Error:', err);
      setMessage('Error uploading resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (e) => {
    const selected = e.target.value;
    setCompanies(selected);
    if (selected.length < 2 || selected.length > 10) {
      setMessage('Please select between 2 and 10 companies.');
    } else {
      setMessage(`Selected ${selected.length} companies: ${selected.join(', ')}`);
    }
  };

  const fetchJobs = async () => {
    if (!technology) {
      setMessage('Please upload a resume or enter technology manually.');
      return;
    }
    if (companies.length < 2 || companies.length > 10) {
      setMessage('Please select between 2 and 10 companies before fetching jobs.');
      return;
    }
    if (!userDetails.phone) {
      setMessage('Please provide your phone number before fetching jobs.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/jobs/fetch`, { technology, companies }, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setJobs(res.data.jobs);
      setMessage(`Successfully fetched jobs for ${companies.length} companies!`);
    } catch (err) {
      console.error('Fetch Jobs Error:', err);
      setMessage(`Error fetching jobs: ${err.response?.data?.msg || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (job) => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/jobs/apply`, { 
        jobId: job.id, 
        technology, 
        userDetails,
        jobTitle: job.title,
        company: job.company
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setMessage(res.data.msg);
      setJobs(jobs.filter(j => j.id !== job.id));
    } catch (err) {
      console.error('Apply Error:', err);
      setMessage('Error applying to job.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/auth/update-details`, userDetails, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setMessage('User details updated successfully!');
    } catch (err) {
      console.error('Update Details Error:', err);
      setMessage('Error updating details.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <Box className="header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a2a44' }}>ZvertexAI</Typography>
        <Button variant="outlined" color="secondary" onClick={() => { localStorage.removeItem('token'); history.push('/'); }}>
          Logout
        </Button>
      </Box>
      <Paper elevation={3} sx={{ padding: '20px', borderRadius: '10px', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a2a44' }}>
          Welcome, {user.subscriptionType} user!
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Your resume will auto-apply to jobs every 30 minutes. Manage manual applications below.
        </Typography>
      </Paper>
      <Box sx={{ display: 'flex', gap: '20px' }}>
        <Paper elevation={3} sx={{ flex: 1, padding: '20px', borderRadius: '10px' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>User Details</Typography>
          <form onSubmit={handleUserDetailsSubmit}>
            <TextField
              label="Email"
              value={userDetails.email}
              disabled
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Phone Number"
              value={userDetails.phone}
              onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Save Details
            </Button>
          </form>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>Upload Resume</Typography>
          <input type="file" accept=".pdf,.docx" onChange={handleResumeUpload} style={{ marginBottom: '10px' }} />
          {loading && <CircularProgress size={24} />}
          {technology && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Detected Technology: {technology}
            </Alert>
          )}
          {!technology && (
            <TextField
              label="Enter Technology Manually"
              value={manualTech}
              onChange={(e) => setManualTech(e.target.value)}
              onBlur={() => setTechnology(manualTech)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          )}
        </Paper>
        <Paper elevation={3} sx={{ flex: 2, padding: '20px', borderRadius: '10px' }}>
          {message && <Alert severity={message.includes('Error') ? 'error' : 'info'} sx={{ mb: 2 }}>{message}</Alert>}
          {technology && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select Companies (2-10)</InputLabel>
                <Select 
                  multiple 
                  value={companies} 
                  onChange={handleCompanyChange} 
                  variant="outlined"
                  renderValue={(selected) => selected.join(', ')}
                >
                  {companyList.map((company) => (
                    <MenuItem key={company} value={company}>
                      <input
                        type="checkbox"
                        checked={companies.includes(company)}
                        readOnly
                      />
                      {company}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={fetchJobs} 
                disabled={loading || companies.length < 2 || companies.length > 10} 
                sx={{ mt: 2 }}
              >
                Fetch Jobs
              </Button>
            </>
          )}
          {jobs.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Available Jobs</Typography>
              <List>
                {jobs.map((job) => (
                  <ListItem key={job.id} sx={{ border: '1px solid #ddd', borderRadius: '5px', mb: 1 }}>
                    <ListItemText primary={`${job.title} - ${job.company}`} secondary={job.location} />
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => applyToJob(job)} 
                      disabled={loading}
                    >
                      Apply
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;