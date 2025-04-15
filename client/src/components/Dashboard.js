import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, TextField, Grid, CircularProgress, Chip } from '@mui/material';
import Sidebar from './Sidebar';
import axios from 'axios';
import { parseResume } from '../utils/resumeParser';

function Dashboard({ user, setUser }) {
  const history = useHistory();
  const [profiles, setProfiles] = useState(user.profiles || []);
  const [newProfile, setNewProfile] = useState({
    name: '',
    phone: '',
    technologies: '',
    companies: '',
    resume: null,
  });
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(user.subscriptionStatus || 'TRIAL');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    fetchApplications();
    checkSubscriptionStatus();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/jobs/history`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setApplications(res.data.applications);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch applications');
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/auth/subscription`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setSubscriptionStatus(res.data.subscriptionStatus);
      setUser({ ...user, subscriptionStatus: res.data.subscriptionStatus });
    } catch (err) {
      setError('Failed to verify subscription');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let resumeData = {};
      if (newProfile.resume) {
        resumeData = await parseResume(newProfile.resume);
      }

      const profileData = {
        name: newProfile.name || resumeData.name || 'Default Profile',
        phone: newProfile.phone || resumeData.phone || '',
        technologies: newProfile.technologies ? newProfile.technologies.split(',').map(t => t.trim()) : resumeData.technologies || [],
        companies: newProfile.companies ? newProfile.companies.split(',').map(c => c.trim()) : [],
        resume: newProfile.resume ? newProfile.resume.name : '',
      };

      const res = await axios.post(`${apiUrl}/api/auth/profile`, profileData, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });

      setProfiles(res.data.profiles);
      setUser({ ...user, profiles: res.data.profiles });
      setNewProfile({ name: '', phone: '', technologies: '', companies: '', resume: null });
      setError('');

      await handleJobSearch(res.data.profiles[res.data.profiles.length - 1]._id);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const handleJobSearch = async (profileId) => {
    setLoading(true);
    try {
      const profile = profiles.find(p => p._id === profileId);
      if (!profile) return;

      const res = await axios.post(
        `${apiUrl}/api/jobs/fetch`,
        { technology: profile.technologies[0], companies: profile.companies },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );

      setJobs(res.data.jobs);
      setError('');

      if (['ACTIVE', 'TRIAL'].includes(subscriptionStatus)) {
        for (const job of res.data.jobs) {
          await handleApply(job, profileId);
        }
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job, profileId) => {
    try {
      await axios.post(
        `${apiUrl}/api/jobs/apply`,
        { jobId: job.id, jobTitle: job.title, company: job.company, jobLink: job.link, technology: job.technologies[0], profileId },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      fetchApplications();
      setJobs(jobs.filter(j => j.id !== job.id));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to apply');
    }
  };

  const renderDashboardContent = () => {
    switch (user.subscriptionType) {
      case 'STUDENT':
        return (
          <>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Job Opportunities
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
              Find jobs tailored to your skills. Upload your resume, select technologies, and let us auto-apply for you.
            </Typography>
          </>
        );
      case 'RECRUITER':
        return (
          <>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Candidate Matching
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
              Access profiles of top candidates matched to your job postings. Review applications and connect directly.
            </Typography>
          </>
        );
      case 'BUSINESS':
        return (
          <>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Recruitment Analytics
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
              Gain insights into hiring trends, application success rates, and optimize your recruitment strategy.
            </Typography>
            <Box sx={{ mb: 4, backgroundColor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: '15px' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Analytics Overview
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Applications Submitted: {applications.length}<br />
                Success Rate: {applications.length > 0 ? `${((applications.filter(a => a.status === 'INTERVIEW').length / applications.length) * 100).toFixed(2)}%` : '0%'}
              </Typography>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)' }}>
      <Sidebar user={user} setUser={setUser} />
      <Box sx={{ flexGrow: 1, p: 4, ml: '250px' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
              {user.subscriptionType} Dashboard
            </Typography>
            <Chip label={subscriptionStatus === 'TRIAL' ? '4-Day Trial' : 'Active'} color={subscriptionStatus === 'TRIAL' ? 'warning' : 'success'} sx={{ mb: 4 }} />
          </Box>
          {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
          {renderDashboardContent()}
          {subscriptionStatus === 'TRIAL' && (
            <Box sx={{ mb: 4, p: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                Your 4-day free trial is active!
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>
                Enjoy full access to {user.subscriptionType} features. Subscribe to continue after the trial.
              </Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, px: 4, py: 1.5 }}
                onClick={() => history.push('/subscription')}
              >
                Subscribe Now
              </Button>
            </Box>
          )}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              Create Profile
            </Typography>
            <Box component="form" onSubmit={handleProfileSubmit} sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Profile Name"
                    fullWidth
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    fullWidth
                    value={newProfile.phone}
                    onChange={(e) => setNewProfile({ ...newProfile, phone: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Technologies (comma-separated)"
                    fullWidth
                    value={newProfile.technologies}
                    onChange={(e) => setNewProfile({ ...newProfile, technologies: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Preferred Companies (comma-separated)"
                    fullWidth
                    value={newProfile.companies}
                    onChange={(e) => setNewProfile({ ...newProfile, companies: e.target.value })}
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5 }}
                  >
                    Upload Resume
                    <input
                      type="file"
                      hidden
                      onChange={(e) => setNewProfile({ ...newProfile, resume: e.target.files[0] })}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Profile & Apply'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Your Profiles
          </Typography>
          <Grid container spacing={3}>
            {profiles.map((profile) => (
              <Grid item xs={12} sm={6} key={profile._id}>
                <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: '15px' }}>
                  <Typography variant="h6" sx={{ color: 'white' }}>{profile.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>Phone: {profile.phone}</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>Technologies: {profile.technologies.join(', ')}</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>Companies: {profile.companies.join(', ')}</Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5 }}
                    onClick={() => handleJobSearch(profile._id)}
                  >
                    Search & Apply Jobs
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
          {jobs.length > 0 && (
            <>
              <Typography variant="h5" sx={{ color: 'white', mt: 4, mb: 2 }}>
                Available Jobs
              </Typography>
              <Grid container spacing={3}>
                {jobs.map((job) => (
                  <Grid item xs={12} sm={6} key={job.id}>
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: '15px' }}>
                      <Typography variant="h6" sx={{ color: 'white' }}>{job.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>Company: {job.company}</Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>Technologies: {job.technologies.join(', ')}</Typography>
                      <Typography variant="body2" sx={{ color: 'white' }}>Job ID: {job.id}</Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, py: 1.5 }}
                        onClick={() => handleApply(job, profiles.find(p => p.technologies.includes(job.technologies[0]))?._id)}
                      >
                        Apply
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          <Typography variant="h5" sx={{ color: 'white', mt: 4, mb: 2 }}>
            Application History
          </Typography>
          <Grid container spacing={3}>
            {applications.map((app) => (
              <Grid item xs={12} sm={6} key={app._id}>
                <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: '15px' }}>
                  <Typography variant="h6" sx={{ color: 'white' }}>{app.jobTitle}</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>Company: {app.company}</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>Technology: {app.technology}</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>Job ID: {app.jobId}</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>Applied: {new Date(app.date).toLocaleDateString()}</Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>Status: {app.status || 'APPLIED'}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ py: 6, mt: 8, backgroundColor: '#1a2a44', borderRadius: '15px' }}>
            <Container maxWidth="lg">
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    ZvertexAI
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Empowering careers with AI-driven solutions.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Quick Links
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-zvertexai')}>
                    Why ZvertexAI?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1, cursor: 'pointer' }} onClick={() => history.push('/interview-faqs')}>
                    Interview FAQs
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                    ZGPT Copilot
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Contact Us
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                    Address: 5900 BALCONES DR #16790 AUSTIN, TX 78731
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                    Phone: 737-239-0920
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                    onClick={() => history.push('/contact-us')}
                  >
                    Reach Out
                  </Button>
                </Grid>
              </Grid>
              <Typography variant="body2" align="center" sx={{ color: 'white', mt: 4 }}>
                © 2025 ZvertexAI. All rights reserved.
              </Typography>
            </Container>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;