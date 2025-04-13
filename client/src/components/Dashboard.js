import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

function Dashboard({ user, handleLogout }) {
  const [resume, setResume] = useState(null);
  const [jobQuery, setJobQuery] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [subscription, setSubscription] = useState(user?.subscription || 'None');
  const [zgptPrompt, setZgptPrompt] = useState('');
  const [zgptResponse, setZgptResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      setLoading(true);
      await axios.post(`${apiUrl}/api/auth/resume`, formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      setResume(file.name);
      alert('Resume uploaded successfully');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error uploading resume');
    } finally {
      setLoading(false);
    }
  };

  const handleJobSearch = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/api/jobs/search`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        params: { query: jobQuery, location: jobLocation },
      });
      setJobs(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobApply = async (job) => {
    try {
      setLoading(true);
      await axios.post(
        `${apiUrl}/api/jobs/apply`,
        {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company.display_name,
          jobUrl: job.redirect_url,
        },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      alert(`Applied to ${job.title}`);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error applying to job');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionChange = async (e) => {
    const newSubscription = e.target.value;
    try {
      setLoading(true);
      await axios.put(
        `${apiUrl}/api/auth/subscription`,
        { subscription: newSubscription },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setSubscription(newSubscription);
      alert('Subscription updated');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleZgptQuery = async () => {
    if (!['Pro', 'Enterprise'].includes(subscription)) {
      alert('ZGPT requires Pro or Enterprise subscription');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${apiUrl}/api/zgpt/query`,
        { prompt: zgptPrompt },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setZgptResponse(res.data.response);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error processing ZGPT query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Dashboard
          </Typography>
          <Box>
            <Button
              variant="contained"
              sx={{ mr: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
              onClick={() => navigate('/contact')}
            >
              Contact Support
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: '#00e676', color: '#00e676', '&:hover': { backgroundColor: 'rgba(0,230,118,0.1)' } }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Profile
                </Typography>
                <Typography>Name: {user?.name}</Typography>
                <Typography>Email: {user?.email}</Typography>
                <Typography>Subscription: {subscription}</Typography>
                {user?.trialActive && (
                  <Typography color="#00e676">4-Day Trial Active</Typography>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel sx={{ color: 'white' }}>Change Subscription</InputLabel>
                  <Select
                    value={subscription}
                    onChange={handleSubscriptionChange}
                    sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
                  >
                    <MenuItem value="Basic">Basic</MenuItem>
                    <MenuItem value="Pro">Pro</MenuItem>
                    <MenuItem value="Enterprise">Enterprise</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Upload Resume
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                >
                  {resume ? 'Replace Resume' : 'Upload Resume'}
                  <input type="file" hidden accept=".pdf,.doc,.docx,.txt" onChange={handleResumeUpload} />
                </Button>
                {resume && <Typography sx={{ mt: 2 }}>Uploaded: {resume}</Typography>}
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Job Search
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Job Title"
                    value={jobQuery}
                    onChange={(e) => setJobQuery(e.target.value)}
                    sx={{
                      flex: 1,
                      input: { color: 'white' },
                      label: { color: 'white' },
                      '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                    }}
                  />
                  <TextField
                    label="Location"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    sx={{
                      flex: 1,
                      input: { color: 'white' },
                      label: { color: 'white' },
                      '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleJobSearch}
                    sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  >
                    Search
                  </Button>
                </Box>
                {loading && <CircularProgress sx={{ color: '#00e676', mb: 2 }} />}
                <List>
                  {jobs.map((job) => (
                    <ListItem
                      key={job.id}
                      sx={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        mb: 1,
                        borderRadius: '10px',
                      }}
                    >
                      <ListItemText
                        primary={job.title}
                        secondary={
                          <>
                            <Typography variant="body2" color="white">
                              {job.company.display_name} - {job.location.display_name}
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                mt: 1,
                                backgroundColor: '#00e676',
                                '&:hover': { backgroundColor: '#00c853' },
                              }}
                              onClick={() => handleJobApply(job)}
                            >
                              Apply
                            </Button>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  ZGPT Career Copilot
                </Typography>
                <TextField
                  label="Ask ZGPT (e.g., resume tips, interview prep)"
                  fullWidth
                  value={zgptPrompt}
                  onChange={(e) => setZgptPrompt(e.target.value)}
                  sx={{
                    mb: 2,
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleZgptQuery}
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                >
                  Ask ZGPT
                </Button>
                {zgptResponse && (
                  <Typography sx={{ mt: 2, p: 2, backgroundColor: 'rgba(0,230,118,0.1)', borderRadius: '10px' }}>
                    {zgptResponse}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;