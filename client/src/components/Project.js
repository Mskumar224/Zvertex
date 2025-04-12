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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Project({ user, setUser }) {
  const { type } = useParams();
  const history = useHistory();
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  const projectDetails = {
    saas: {
      title: 'SaaS Solutions',
      description: 'Build scalable, cloud-based SaaS applications with cutting-edge technologies.',
    },
    cloud: {
      title: 'Cloud Migration',
      description: 'Seamlessly migrate your infrastructure to the cloud with our expert guidance.',
    },
    ai: {
      title: 'AI Automation',
      description: 'Automate workflows and enhance decision-making with AI-driven solutions.',
    },
    bigdata: {
      title: 'Big Data Analytics',
      description: 'Harness the power of big data to uncover actionable insights.',
    },
    devops: {
      title: 'DevOps Integration',
      description: 'Streamline development and operations with our DevOps expertise.',
    },
  };

  const project = projectDetails[type] || { title: 'Project', description: 'Details coming soon!' };

  if (!user) {
    history.push('/register');
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
              <MenuItem onClick={() => { handleClose(); history.push('/projects/saas'); }}>SaaS Solutions</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/cloud'); }}>Cloud Migration</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/ai'); }}>AI Automation</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/bigdata'); }}>Big Data Analytics</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/devops'); }}>DevOps Integration</MenuItem>
            </Menu>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Button
          variant="outlined"
          sx={{ mb: 2, color: 'white', borderColor: 'white' }}
          onClick={() => history.push('/dashboard')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          {project.title}
        </Typography>
        <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {project.description}
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px' }}
              onClick={() => history.push('/contact')}
            >
              Contact Us to Join
            </Button>
          </CardContent>
        </Card>
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

export default Project;