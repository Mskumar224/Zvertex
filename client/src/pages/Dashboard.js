import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Select, MenuItem, Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import BackButton from '../components/BackButton';
import ResumeUpload from '../components/ResumeUpload';
import DocumentUpload from '../components/DocumentUpload';

function Dashboard() {
  const [user, setUser] = useState({ email: '', phone: '', subscription: 'NONE', preferences: { companies: [], keywords: [] }, resumes: 0, submissions: 0, profile: { isCompleted: false }, resumesUploaded: 0 });
  const [company, setCompany] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);

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
        setShowPreferences(data.preferences.companies.length === 0);
        setShowResumeUpload(data.resumesUploaded === 0);
        if (data.preferences.companies.length > 0) {
          data.preferences.companies.forEach(fetchJobs);
        }
      } catch (error) {
        alert('Failed to fetch user data! Please try logging in again.');
        console.error(error);
        localStorage.removeItem('token');
        window.location.href = '/login';
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
        console.error(error);
      }
    };
    fetchUser();
    fetchTrackedJobs();
  }, []);

  // Auto-fetch jobs every 30 minutes
  useEffect(() => {
    if (user.preferences.companies.length === 0) return;

    const fetchInterval = setInterval(() => {
      user.preferences.companies.forEach(fetchJobs);
    }, 30 * 60 * 1000); // Every 30 minutes

    return () => clearInterval(fetchInterval);
  }, [user.preferences.companies]);

  // Auto-apply jobs every 30 minutes
  useEffect(() => {
    if (jobs.length === 0) return;

    const eligibleJobs = jobs.filter(
      (job) => !job.applied && !job.requiresDocs && !trackedJobs.some((tj) => tj.jobId === job.id)
    );

    if (eligibleJobs.length === 0) return;

    const applyInterval = setInterval(async () => {
      for (const job of eligibleJobs) {
        await handleAutoApply(job);
      }
    }, 30 * 60 * 1000); // Every 30 minutes

    return () => clearInterval(applyInterval);
  }, [jobs, trackedJobs]);

  const handleResumeParsed = async (newKeywords) => {
    setKeywords(newKeywords);
    const newPreferences = { ...user.preferences, keywords: newKeywords };
    setUser({ ...user, preferences: newPreferences });
    await savePreferences(newPreferences);
    setShowResumeUpload(false);
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
        const newPreferences = { ...user.preferences, companies: newCompanies };
        setUser({ ...user, preferences: newPreferences });
        await savePreferences(newPreferences);
        fetchJobs(data.company);
        setShowPreferences(false);
      } else {
        alert('Company not detected online! Please select a valid company.');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Detection failed!');
      console.error(error);
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
      console.error(error);
    }
  };

  const fetchJobs = async (companyName) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/fetch-jobs`,
        { company: companyName, keywords },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setJobs((prevJobs) => [
        ...prevJobs,
        ...data.jobs.filter((newJob) => !prevJobs.some((job) => job.id === newJob.id))
      ]);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to fetch jobs!');
      console.error(error);
    }
  };

  const handleAutoApply = async (job) => {
    if (job.applied) return;
    if (job.requiresDocs) return;
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

  const handleManualApply = async (job) => {
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
          { jobId: job.id, company: job.company, link: job.link },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        alert(`Applied to ${job.title} at ${job.company}! Check your email for confirmation.`);
        setJobs(jobs.map(j => j.id === job.id ? { ...j, applied: true } : j));
        setTrackedJobs([...trackedJobs, { ...job, applied: true, createdAt: new Date() }]);
      } catch (error) {
        alert(error.response?.data?.error || 'Application failed!');
        console.error(error);
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="lg">
        <BackButton />
        <Typography variant="h3" gutterBottom sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '1.8rem', sm: '2.5rem' } }}>
          ZvertexAI Dashboard
        </Typography>
        <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: { xs: 2, sm: 4 }, mb: 4 }}>
          <Typography variant="h5" sx={{ color: '#1a2a44', mb: 2, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>User Profile</Typography>
          <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Email: {user.email}</Typography>
          <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Phone: {user.phone}</Typography>
          <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Subscription: {user.subscription}</Typography>
          <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Resumes Allowed: {user.resumes}</Typography>
          <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Submissions/Day: {user.submissions}</Typography>
          <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>First Name: {user.profile.firstName}</Typography>
          <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Last Name: {user.profile.lastName}</Typography>
          <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Experience: {user.profile.experience}</Typography>
          <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Education: {user.profile.education}</Typography>
        </Box>
        {showPreferences && (
          <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: { xs: 2, sm: 4 }, mb: 4 }}>
            <Typography variant="h5" sx={{ color: '#1a2a44', mb: 2, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Preferences</Typography>
            <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Companies: {user.preferences.companies.join(', ') || 'None'}</Typography>
            <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Keywords: {user.preferences.keywords.join(', ') || 'None'}</Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 3 }}>
              <Select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                displayEmpty
                fullWidth
                sx={{ maxWidth: { xs: '100%', sm: 300 }, background: 'white' }}
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
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                onClick={handleCompanyDetect}
              >
                Detect & Add
              </Button>
            </Box>
          </Box>
        )}
        {showResumeUpload && (
          <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: { xs: 2, sm: 4 }, mb: 4 }}>
            <Typography sx={{ color: '#1a2a44', mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>Upload Resume</Typography>
            <ResumeUpload onResumeParsed={handleResumeParsed} />
          </Box>
        )}
        {(user.preferences.companies.length > 0 || user.resumesUploaded > 0) && (
          <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: { xs: 2, sm: 4 }, mb: 4 }}>
            <Typography variant="h5" sx={{ color: '#1a2a44', mb: 2, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Update Preferences</Typography>
            <Button
              variant="outlined"
              sx={{ color: '#1a2a44', borderColor: '#1a2a44', '&:hover': { borderColor: '#ff6d00', color: '#ff6d00' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              onClick={() => setShowPreferences(true)}
            >
              Update Companies
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 2, color: '#1a2a44', borderColor: '#1a2a44', '&:hover': { borderColor: '#ff6d00', color: '#ff6d00' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              onClick={() => setShowResumeUpload(true)}
            >
              Update Resume
            </Button>
          </Box>
        )}
        <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: { xs: 2, sm: 4 }, mb: 4 }}>
          <Typography variant="h5" sx={{ color: '#1a2a44', mb: 2, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Available Jobs</Typography>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Box key={job.id} sx={{ p: 2, border: '1px solid #e0e0e0', mb: 2, borderRadius: 2 }}>
                <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>{job.title} - {job.company}</Typography>
                <Typography variant="body2" sx={{ color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ color: '#ff6d00' }}>{job.link}</a>
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 1, backgroundColor: job.applied ? '#757575' : '#ff6d00', '&:hover': { backgroundColor: job.applied ? '#616161' : '#e65100' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  onClick={() => handleManualApply(job)}
                  disabled={job.applied}
                >
                  {job.applied ? 'Applied' : 'Apply Now'}
                </Button>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>No jobs available. Add companies to fetch jobs.</Typography>
          )}
        </Box>
        <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: { xs: 2, sm: 4 } }}>
          <Typography variant="h5" sx={{ color: '#1a2a44', mb: 2, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Job Application Tracker</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Job Title</TableCell>
                <TableCell sx={{ color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Company</TableCell>
                <TableCell sx={{ color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Link</TableCell>
                <TableCell sx={{ color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Date Applied</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trackedJobs.map((job) => (
                <TableRow key={job.jobId}>
                  <TableCell sx={{ color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job.title}</TableCell>
                  <TableCell sx={{ color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job.company}</TableCell>
                  <TableCell>
                    <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ color: '#ff6d00', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{job.link}</a>
                  </TableCell>
                  <TableCell sx={{ color: '#1a2a44', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography sx={{ mt: 2, color: '#1a2a44', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Total Applied: {trackedJobs.length}</Typography>
        </Box>
        {selectedJob && <DocumentUpload job={selectedJob} onClose={() => setSelectedJob(null)} />}
      </Container>
    </Box>
  );
}

export default Dashboard;