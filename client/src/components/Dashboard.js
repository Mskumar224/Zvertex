import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, Button, TextField, CircularProgress, IconButton, Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import XLSX from 'xlsx';

function Dashboard({ user, setUser }) {
  const history = useHistory();
  const [profile, setProfile] = useState({ name: '', phone: '', email: '', technologies: [], companies: [], resume: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          axios.get(`${apiUrl}/api/jobs/fetch`, {
            headers: { 'x-auth-token': localStorage.getItem('token') },
            params: { technology: user?.profiles?.[0]?.technologies?.[0] || 'JavaScript' },
          }),
          axios.get(`${apiUrl}/api/jobs/history`, { headers: { 'x-auth-token': localStorage.getItem('token') } }),
        ]);
        setJobs(jobsRes.data.jobs);
        setApplications(appsRes.data.applications);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch data');
      }
    };
    if (user) fetchData();
  }, [user, apiUrl]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('name', profile.name);
      formData.append('phone', profile.phone);
      formData.append('email', profile.email);
      formData.append('technologies', profile.technologies.join(','));
      formData.append('companies', profile.companies.join(','));

      const res = await axios.post(`${apiUrl}/api/auth/profile`, formData, {
        headers: { 'x-auth-token': localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' },
      });
      setUser({ ...user, profiles: res.data.profiles });
      setProfile({ name: '', phone: '', email: '', technologies: [], companies: [], resume: '' });
      setResumeFile(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    try {
      await axios.post(
        `${apiUrl}/api/jobs/apply`,
        { ...job, profileId: user.profiles[0]._id },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setApplications([...applications, { ...job, profileId: user.profiles[0]._id, status: 'APPLIED' }]);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to apply');
    }
  };

  const downloadXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(applications.map(app => ({
      JobID: app.jobId,
      Title: app.jobTitle,
      Company: app.company,
      Technology: app.technology,
      Status: app.status,
      Date: new Date(app.date).toLocaleDateString(),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications');
    XLSX.write(wb, 'applications.xlsx');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => history.goBack()} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            {user?.subscriptionType} Dashboard
          </Typography>
        </Box>
        {user?.subscriptionStatus === 'TRIAL' && (
          <Typography sx={{ color: 'white', mb: 2, textAlign: 'center' }}>
            Trial Mode: Expires in 4 days
          </Typography>
        )}
        {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Create Profile</Typography>
                <Box component="form" onSubmit={handleProfileSubmit}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                  <TextField
                    label="Phone"
                    fullWidth
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                  <TextField
                    label="Technologies (comma-separated)"
                    fullWidth
                    value={profile.technologies.join(',')}
                    onChange={(e) => setProfile({ ...profile, technologies: e.target.value.split(',').map(t => t.trim()) })}
                    sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                  <TextField
                    label="Companies (comma-separated)"
                    fullWidth
                    value={profile.companies.join(',')}
                    onChange={(e) => setProfile({ ...profile, companies: e.target.value.split(',').map(c => c.trim()) })}
                    sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                  />
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ mb: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  >
                    Upload Resume
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                    />
                  </Button>
                  {resumeFile && <Typography sx={{ color: 'white', mb: 2 }}>{resumeFile.name}</Typography>}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Profile'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Available Jobs</Typography>
                {jobs.map((job) => (
                  <Box key={job.id} sx={{ mb: 2, p: 2, border: '1px solid white', borderRadius: '8px' }}>
                    <Typography variant="body1">{job.title}</Typography>
                    <Typography variant="body2">{job.company}</Typography>
                    <Typography variant="body2">{job.technologies.join(', ')}</Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 1, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                      onClick={() => handleApply(job)}
                    >
                      Apply
                    </Button>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Application History</Typography>
                <Button
                  variant="contained"
                  sx={{ mb: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={downloadXLSX}
                >
                  Download XLSX
                </Button>
                <Table sx={{ backgroundColor: 'transparent' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Job ID</TableCell>
                      <TableCell sx={{ color: 'white' }}>Title</TableCell>
                      <TableCell sx={{ color: 'white' }}>Company</TableCell>
                      <TableCell sx={{ color: 'white' }}>Technology</TableCell>
                      <TableCell sx={{ color: 'white' }}>Status</TableCell>
                      <TableCell sx={{ color: 'white' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app._id}>
                        <TableCell sx={{ color: 'white' }}>{app.jobId}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{app.jobTitle}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{app.company}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{app.technology}</TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <Chip label={app.status} color={app.status === 'APPLIED' ? 'primary' : 'secondary'} />
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{new Date(app.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;