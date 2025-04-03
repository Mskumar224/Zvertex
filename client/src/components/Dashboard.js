import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
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
      const tech = res.data.technology; // Backend returns parsed technology
      setTechnology(tech || '');
      setMessage(tech ? 'Technology detected!' : 'Could not detect technology. Please enter manually.');
    } catch (err) {
      console.error('Resume Upload Error:', err);
      setMessage('Error uploading resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (e) => {
    const selected = e.target.value;
    if (selected.length >= 2 && selected.length <= 10) {
      setCompanies(selected);
    } else {
      setMessage('Please select between 2 and 10 companies.');
    }
  };

  const fetchJobs = async () => {
    if (!technology || companies.length < 2) {
      setMessage('Please provide technology and select 2-10 companies.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/jobs/fetch`, { technology, companies }, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setJobs(res.data.jobs);
      setMessage('Jobs fetched successfully!');
    } catch (err) {
      console.error('Fetch Jobs Error:', err);
      setMessage('Error fetching jobs.');
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (job) => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/jobs/apply`, { jobId: job.id, technology }, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setMessage(res.data.msg);
    } catch (err) {
      console.error('Apply Error:', err);
      setMessage('Error applying to job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>ZvertexAI</h1>
        <div className="nav-links">
          <a href="/" onClick={() => localStorage.removeItem('token')}>Logout</a>
        </div>
      </div>
      <div className="hero">
        <Typography variant="h2">Dashboard</Typography>
        <Typography variant="body1">Welcome, {user.subscriptionType} user!</Typography>
      </div>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Resume Upload */}
        <Typography variant="h5">Upload Your Resume</Typography>
        <input type="file" accept=".pdf,.docx" onChange={handleResumeUpload} />
        {loading && <CircularProgress />}
        {message && <Typography>{message}</Typography>}

        {/* Manual Technology Input */}
        {!technology && (
          <TextField
            label="Enter Technology Manually"
            value={manualTech}
            onChange={(e) => setManualTech(e.target.value)}
            onBlur={() => setTechnology(manualTech)}
            fullWidth
            margin="normal"
          />
        )}

        {/* Company Selection */}
        {technology && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Companies (2-10)</InputLabel>
              <Select multiple value={companies} onChange={handleCompanyChange}>
                {companyList.map((company) => (
                  <MenuItem key={company} value={company}>{company}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={fetchJobs} disabled={loading}>
              Fetch Jobs
            </Button>
          </>
        )}

        {/* Job Listings */}
        {jobs.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h5">Available Jobs</Typography>
            {jobs.map((job) => (
              <div key={job.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                <Typography>{job.title} - {job.company}</Typography>
                <Button variant="contained" color="secondary" onClick={() => applyToJob(job)}>
                  Apply
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;