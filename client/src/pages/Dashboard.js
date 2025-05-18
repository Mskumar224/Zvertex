import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Select, MenuItem, Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import BackButton from '../components/BackButton';

function Dashboard() {
  const [user, setUser] = useState({ email: '', phone: '', subscription: 'NONE', preferences: { companies: [], keywords: [] } });
  const [company, setCompany] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [trackedJobs, setTrackedJobs] = useState([]);
  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook', 'Tesla', 'IBM', 'Oracle', 'Intel', 'Cisco',
    'Netflix', 'Adobe', 'Salesforce', 'LinkedIn', 'Twitter', 'Uber', 'Lyft', 'Airbnb', 'Dropbox', 'Slack',
    'Zoom', 'Shopify', 'Stripe', 'PayPal', 'Square', 'Atlassian', 'GitHub', 'Zendesk', 'ServiceNow', 'Workday',
    'Snowflake', 'Datadog', 'Twilio', 'Okta', 'CrowdStrike', 'Palo Alto Networks', 'VMware', 'Red Hat', 'SAP', 'Splunk'
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(data);
        setKeywords(data.preferences.keywords || []);
      } catch (error) {
        alert('Failed to fetch user data!');
      }
    };
    const fetchTrackedJobs = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/tracker`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTrackedJobs(data);
      } catch (error) {
        alert('Failed to fetch job tracker!');
      }
    };
    fetchUser();
    fetchTrackedJobs();
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/upload-resume`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }
      });
      setKeywords(data.keywords);
      setUser({ ...user, preferences: { ...user.preferences, keywords: data.keywords } });
      await savePreferences({ ...user.preferences, keywords: data.keywords });
    } catch (error) {
      alert(error.response?.data?.error || 'Resume upload failed!');
    }
  };

  const handleCompanyDetect = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/detect-company`,
        { company: manualCompany || company },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (data.valid) {
        const newCompanies = [...new Set([...user.preferences.companies, data.company])];
        setUser({ ...user, preferences: { ...user.preferences, companies: newCompanies } });
        await savePreferences({ ...user.preferences, companies: newCompanies });
        fetchJobs(data.company);
      } else {
        alert('Company not detected online! Please select a valid company.');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Detection failed!');
    }
  };

  const savePreferences = async (newPreferences) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/save-preferences`,
        { preferences: newPreferences },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Preferences saved successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save preferences!');
    }
  };

  const fetchJobs = async (companyName) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/fetch-jobs`,
        { company: companyName, keywords },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setJobs(data.jobs);
      // Initiate auto-apply for detected jobs
      for (const job of data.jobs) {
        if (!trackedJobs.some(tj => tj.jobId === job.id)) {
          await handleAutoApply(job);
        }
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to fetch jobs!');
    }
  };

  const handleAutoApply = async (job) => {
    if (job.applied) return;
    if (job.requiresDocs) return; // Skip jobs requiring documents
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/apply`,
        { jobId: job.id, company: job.company, link: job.link },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setJobs(jobs.map(j => j.id === job.id ? { ...j, applied: true } : j));
      setTrackedJobs([...trackedJobs, { ...job, applied: true, createdAt: new Date() }]);
    } catch (error) {
      console.error('Auto-apply error:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <BackButton />
        <Typography variant="h3" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
          ZvertexAI Dashboard
        </Typography>
        <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ color: '#1a2a44', mb: 2 }}>User Profile</Typography>
          <Typography sx={{ color: '#1a2a44' }}>Email: {user.email}</Typography>
          <Typography sx={{ color: '#1a2a44' }}>Phone: {user.phone}</Typography>
          <Typography sx={{ color: '#1a2a44' }}>Subscription: {user.subscription}</Typography>
        </Box>
        <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ color: '#1a2a44', mb: 2 }}>Preferences</Typography>
          <Typography sx={{ color: '#1a2a44' }}>Companies: {user.preferences.companies.join(', ') || 'None'}</Typography>
          <Typography sx={{ color: '#1a2a44' }}>Keywords: {user.preferences.keywords.join(', ') || 'None'}</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ maxWidth: 300, background: 'white' }}
            >
              <MenuItem value="">Select from list</MenuItem>
              {companies.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
            <TextField
              label="Or Enter Manually"
              value={manualCompany}
              onChange={(e) => setManualCompany(e.target.value)}
              sx={{ flexGrow: 1, background: 'white' }}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
              onClick={handleCompanyDetect}
            >
              Detect & Add
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ color: '#1a2a44', mb: 2 }}>Upload Resume</Typography>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleResumeUpload}
              style={{ display: 'block', marginBottom: '16px' }}
            />
          </Box>
        </Box>
        <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: 4 }}>
          <Typography variant="h5" sx={{ color: '#1a2a44', mb: 2 }}>Job Application Tracker</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#1a2a44' }}>Job Title</TableCell>
                <TableCell sx={{ color: '#1a2a44' }}>Company</TableCell>
                <TableCell sx={{ color: '#1a2a44' }}>Link</TableCell>
                <TableCell sx={{ color: '#1a2a44' }}>Date Applied</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trackedJobs.map((job) => (
                <TableRow key={job.jobId}>
                  <TableCell sx={{ color: '#1a2a44' }}>{job.title}</TableCell>
                  <TableCell sx={{ color: '#1a2a44' }}>{job.company}</TableCell>
                  <TableCell>
                    <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ color: '#ff6d00' }}>{job.link}</a>
                  </TableCell>
                  <TableCell sx={{ color: '#1a2a44' }}>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography sx={{ mt: 2, color: '#1a2a44' }}>Total Applied: {trackedJobs.length}</Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;