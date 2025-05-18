import React, { useState } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Select, Box } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function JobApply({ keywords, maxResumes, maxSubmissions }) {
  const [company, setCompany] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [preferences, setPreferences] = useState({ companies: [], keywords });
  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook', 'Tesla', 'IBM', 'Oracle', 'Intel', 'Cisco',
    'Netflix', 'Adobe', 'Salesforce', 'LinkedIn', 'Twitter', 'Uber', 'Lyft', 'Airbnb', 'Dropbox', 'Slack',
    'Zoom', 'Shopify', 'Stripe', 'PayPal', 'Square', 'Atlassian', 'GitHub', 'Zendesk', 'ServiceNow', 'Workday',
    'Snowflake', 'Datadog', 'Twilio', 'Okta', 'CrowdStrike', 'Palo Alto Networks', 'VMware', 'Red Hat', 'SAP', 'Splunk'
  ];

  const handleCompanyDetect = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/detect-company`,
        { company: manualCompany || company },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (data.valid) {
        setPreferences({ ...preferences, companies: [...preferences.companies, data.company] });
        fetchJobs(data.company);
      } else {
        alert('Company not detected online! Please select a valid company.');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Detection failed!');
    }
  };

  const savePreferences = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/save-preferences`,
        { preferences },
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
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to fetch jobs!');
    }
  };

  const handleApply = async (job) => {
    if (job.applied) {
      alert('This job has already been applied to!');
      return;
    }
    if (job.requiresDocs) {
      setSelectedJob(job);
    } else {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/job/apply`,
          { jobId: job.id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        alert(`Applied to ${job.title} at ${job.company}! Check your email for confirmation.`);
        setJobs(jobs.map(j => j.id === job.id ? { ...j, applied: true } : j));
      } catch (error) {
        alert(error.response?.data?.error || 'Application failed!');
      }
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h5" gutterBottom>Select a Company</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          displayEmpty
          fullWidth
          sx={{ maxWidth: 300 }}
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
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleCompanyDetect}>
          Detect & Proceed
        </Button>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Preferences</Typography>
        <Typography>Companies: {preferences.companies.join(', ') || 'None'}</Typography>
        <Typography>Keywords: {preferences.keywords.join(', ')}</Typography>
        <Button variant="outlined" onClick={savePreferences} sx={{ mt: 2 }}>
          Save Preferences
        </Button>
      </Box>
      {jobs.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>Available Jobs</Typography>
          {jobs.map((job) => (
            <Box key={job.id} sx={{ p: 2, border: '1px solid #e0e0e0', mb: 2, borderRadius: 2 }}>
              <Typography>{job.title} - {job.company}</Typography>
              <Typography variant="body2">
                <a href={job.link} target="_blank" rel="noopener noreferrer">{job.link}</a>
              </Typography>
              <Button
                variant="contained"
                color={job.applied ? 'secondary' : 'primary'}
                onClick={() => handleApply(job)}
                disabled={job.applied}
                sx={{ mt: 1 }}
              >
                {job.applied ? 'Applied' : 'Apply Now'}
              </Button>
            </Box>
          ))}
        </Box>
      )}
      {selectedJob && <DocumentUpload job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </Container>
  );
}

export default JobApply;