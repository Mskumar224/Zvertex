import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Menu,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function Dashboard({ user, setUser }) {
  const history = useHistory();
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);
  const [technology, setTechnology] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [profile, setProfile] = useState({ name: '', phone: '', email: '', resume: '', technologies: [], companies: [] });
  const [recruiterProfiles, setRecruiterProfiles] = useState([]);
  const [businessRecruiters, setBusinessRecruiters] = useState([]);

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/jobs/search`,
        { technology, location },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setJobs(res.data.jobs);
      setError('');
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      setJobs([]);
    }
    setLoading(false);
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs/applied`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setAppliedJobs(res.data.jobs);
    } catch (err) {
      console.error('Failed to fetch applied jobs.');
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch profile.');
    }
  };

  const handleRecruiterProfileAdd = async () => {
    try {
      const newProfile = {
        name: `Profile ${recruiterProfiles.length + 1}`,
        email: `profile${recruiterProfiles.length + 1}@example.com`,
        resume: '',
        technologies: [],
        companies: [],
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/recruiter-profile`,
        newProfile,
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setRecruiterProfiles([...recruiterProfiles, res.data]);
    } catch (err) {
      console.error('Failed to add recruiter profile.');
    }
  };

  const handleRecruiterProfileDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/auth/recruiter-profile/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setRecruiterProfiles(recruiterProfiles.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete recruiter profile.');
    }
  };

  const handleBusinessRecruiterAdd = async () => {
    try {
      const newRecruiter = {
        name: `Recruiter ${businessRecruiters.length + 1}`,
        email: `recruiter${businessRecruiters.length + 1}@example.com`,
        subscriptionType: 'recruiter',
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/business-recruiter`,
        newRecruiter,
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setBusinessRecruiters([...businessRecruiters, res.data]);
    } catch (err) {
      console.error('Failed to add business recruiter.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  useEffect(() => {
    fetchAppliedJobs();
    fetchProfile();
    if (user?.subscriptionType === 'recruiter') {
      // Fetch recruiter profiles
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/recruiter-profiles`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        })
        .then((res) => setRecruiterProfiles(res.data))
        .catch((err) => console.error('Failed to fetch recruiter profiles.'));
    } else if (user?.subscriptionType === 'business') {
      // Fetch business recruiters
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/business-recruiters`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        })
        .then((res) => setBusinessRecruiters(res.data))
        .catch((err) => console.error('Failed to fetch business recruiters.'));
    }
  }, [user]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer', color: '#ffffff' }}
            onClick={() => history.push('/')}
          >
            ZvertexAI
          </Typography>
          <Box>
            <Button
              sx={{ color: '#ffffff' }}
              onClick={handleServicesClick}
              endIcon={<ArrowDropDownIcon sx={{ color: '#ffffff' }} />}
            >
              Services
            </Button>
            <Menu
              anchorEl={servicesAnchor}
              open={Boolean(servicesAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: '#ffffff' } }}
            >
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/faq'); }}>
                Interview FAQs
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/why-us'); }}>
                Why ZvertexAI?
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/zgpt'); }}>
                ZGPT - Your Copilot
              </MenuItem>
            </Menu>
            <Button
              sx={{ color: '#ffffff' }}
              onClick={handleProjectsClick}
              endIcon={<ArrowDropDownIcon sx={{ color: '#ffffff' }} />}
            >
              Join Our Projects
            </Button>
            <Menu
              anchorEl={projectsAnchor}
              open={Boolean(projectsAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: '#ffffff' } }}
            >
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/projects/saas'); }}>
                SaaS Solutions
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/projects/cloud'); }}>
                Cloud Migration
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/projects/ai'); }}>
                AI Automation
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/projects/bigdata'); }}>
                Big Data Analytics
              </MenuItem>
              <MenuItem sx={{ color: '#ffffff' }} onClick={() => { handleClose(); history.push('/projects/devops'); }}>
                DevOps Integration
              </MenuItem>
            </Menu>
            <Button sx={{ color: '#ffffff' }} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Welcome, {user?.email}
        </Typography>

        {user?.subscriptionType === 'student' || user?.subscriptionType === 'trial' ? (
          <>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Your Profile
            </Typography>
            <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 4, mb: 6 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Name:</strong> {profile.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Phone:</strong> {profile.phone || 'Not set'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Email:</strong> {profile.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Resume:</strong> {profile.resume ? <a href={profile.resume} target="_blank" style={{ color: '#ff6d00' }}>View</a> : 'Not uploaded'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Technologies:</strong> {profile.technologies?.join(', ') || 'None'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Companies Selected:</strong> {profile.companies?.join(', ') || 'None'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Jobs Applied:</strong> {appliedJobs.length}</Typography>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : user?.subscriptionType === 'recruiter' ? (
          <>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Manage Profiles (Up to 5)
            </Typography>
            <Button
              variant="contained"
              sx={{ mb: 3, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
              onClick={handleRecruiterProfileAdd}
              disabled={recruiterProfiles.length >= 5}
            >
              Add Profile
            </Button>
            <Table sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white' }}>Technologies</TableCell>
                  <TableCell sx={{ color: 'white' }}>Companies</TableCell>
                  <TableCell sx={{ color: 'white' }}>Resume</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recruiterProfiles.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell sx={{ color: 'white' }}>{p.name}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{p.email}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{p.technologies?.join(', ') || 'None'}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{p.companies?.join(', ') || 'None'}</TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      {p.resume ? <a href={p.resume} target="_blank" style={{ color: '#ff6d00' }}>View</a> : 'None'}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleRecruiterProfileDelete(p.id)}>
                        <DeleteIcon sx={{ color: '#ff6d00' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : user?.subscriptionType === 'business' ? (
          <>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Manage Recruiters (Up to 3)
            </Typography>
            <Button
              variant="contained"
              sx={{ mb: 3, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
              onClick={handleBusinessRecruiterAdd}
              disabled={businessRecruiters.length >= 3}
            >
              Add Recruiter
            </Button>
            {businessRecruiters.map((recruiter) => (
              <Box key={recruiter.id} sx={{ mb: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recruiter: {recruiter.name} ({recruiter.email})
                </Typography>
                <Table sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>Name</TableCell>
                      <TableCell sx={{ color: 'white' }}>Email</TableCell>
                      <TableCell sx={{ color: 'white' }}>Technologies</TableCell>
                      <TableCell sx={{ color: 'white' }}>Companies</TableCell>
                      <TableCell sx={{ color: 'white' }}>Resume</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recruiter.profiles?.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell sx={{ color: 'white' }}>{p.name}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{p.email}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{p.technologies?.join(', ') || 'None'}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{p.companies?.join(', ') || 'None'}</TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {p.resume ? <a href={p.resume} target="_blank" style={{ color: '#ff6d00' }}>View</a> : 'None'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ))}
          </>
        ) : null}

        <Typography variant="h5" sx={{ mb: 3, mt: 6 }}>
          Search Jobs
        </Typography>
        <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', p: 4, mb: 6 }}>
          <form onSubmit={handleSearch}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Technology"
                  fullWidth
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Location"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px', height: '100%' }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <CircularProgress sx={{ color: '#ff6d00' }} />
            </Box>
          ) : jobs.length > 0 ? (
            <Box sx={{ mt: 3 }}>
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  sx={{ mb: 2, backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}
                  onClick={() => history.push(`/job/${job.id}`)}
                >
                  <CardContent>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>{job.company} - {job.location}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : null}
        </Box>

        <Typography variant="h5" sx={{ mb: 3 }}>
          Applied Jobs
        </Typography>
        {appliedJobs.length > 0 ? (
          <Grid container spacing={2}>
            {appliedJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.jobId}>
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">{job.jobTitle}</Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>{job.company}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No jobs applied yet.</Typography>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;