import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Container,
  TextField,
  Grid,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function ResetPassword({ user, setUser }) {
  const { token } = useParams();
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, { password });
      setSuccess('Password reset successfully. Please login.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to reset password.');
      setSuccess('');
    }
  };

  if (user) {
    history.push('/dashboard');
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>
            ZvertexAI
          </Typography>
          <Box>
            <Button color="inherit" onClick={handleServicesClick} endIcon={<ArrowDropDownIcon />}>
              Services
            </Button>
            <Menu
              anchorEl={servicesAnchor}
              open={Boolean(servicesAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}
            >
              <MenuItem onClick={() => { handleClose(); history.push('/faq'); }}>Interview FAQs</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/why-us'); }}>Why ZvertexAI?</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/zgpt'); }}>ZGPT - Your Copilot</MenuItem>
            </Menu>
            <Button color="inherit" onClick={handleProjectsClick} endIcon={<ArrowDropDownIcon />}>
              Join Our Projects
            </Button>
            <Menu
              anchorEl={projectsAnchor}
              open={Boolean(projectsAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}
            >
              <MenuItem onClick={() => { handleClose(); history.push('/register'); }}>SaaS Solutions</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/register'); }}>Cloud Migration</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/register'); }}>AI Automation</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/register'); }}>Big Data Analytics</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/register'); }}>DevOps Integration</MenuItem>
            </Menu>
            <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
            <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pt: 8, pb: 6 }}>
        <Button
          variant="outlined"
          sx={{ mb: 2, color: 'white', borderColor: 'white' }}
          onClick={() => history.push('/login')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Login
        </Button>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
          />
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {success && <Typography sx={{ mb: 2, color: '#00e676' }}>{success}</Typography>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px', py: 1.5 }}
          >
            Reset Password
          </Button>
        </form>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>ZvertexAI</Typography>
              <Typography variant="body2">Empowering careers with AI-driven job matching, projects, and ZGPT copilot.</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/faq')}>Interview FAQs</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/why-us')}>Why ZvertexAI?</Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/zgpt')}>ZGPT Copilot</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Address: 5900 BALCONES DR #16790, AUSTIN, TX 78731</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Phone: 737-239-0920</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/contact')}>Email Us</Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>© 2025 ZvertexAI. All rights reserved.</Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default ResetPassword;