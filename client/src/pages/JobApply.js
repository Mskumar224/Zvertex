import React, { useState } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Select, Box } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function JobApply({ keywords, maxResumes, maxSubmissions }) {
  const [company, setCompany] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
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
        fetchJobs(data.company);
      } else {
        alert('Company not detected online! Please select a valid company.');
      }
    } catch (error) {
      alert('Detection failed!');
    }
  };

  const fetchJobs = async (companyName) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/job/fetch-jobs`,
      { company: companyName, keywords },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    setJobs(data.jobs);
  };

  const handleApply = async (job) => {
    if (job.applied) {
      alert('This job has already been applied to!');
      return;
    }
    if (job.requiresDocs) {
      setSelectedJob(job);
    } else {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/apply`,
        { jobId: job.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert(`Applied to ${job.title} at ${job.company}! Check your email for confirmation.`);
      setJobs(jobs.map(j => j.id === job.id ? { ...j, applied: true } : j));
    }
  };

  return (
    <Container sx={{ py: 5 }} className="zgpt-container">
      <div className="card">
        <Typography variant="h5" gutterBottom>Select a Company</Typography>
        <Box className="zgpt-search-form">
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleCompanyDetect}
            className="back-button"
          >
            Detect & Proceed
          </Button>
        </Box>
        {jobs.length > 0 && (
          <Box className="zgpt-results">
            <Typography variant="h6" gutterBottom>Available Jobs</Typography>
            {jobs.map((job) => (
              <Box key={job.id} className="card">
                <Typography>{job.title} - {job.company}</Typography>
                <Typography variant="body2">
                  <a href={job.link} target="_blank" rel="noopener noreferrer">{job.link}</a>
                </Typography>
                <Button
                  variant="contained"
                  color={job.applied ? 'secondary' : 'primary'}
                  onClick={() => handleApply(job)}
                  disabled={job.applied}
                  className="back-button"
                  sx={{ mt: 1 }}
                >
                  {job.applied ? 'Applied' : 'Apply Now'}
                </Button>
              </Box>
            ))}
          </Box>
        )}
        {selectedJob && <DocumentUpload job={selectedJob} onClose={() => setSelectedJob(null)} />}
      </div>
    </Container>
  );
}

export default JobApply;