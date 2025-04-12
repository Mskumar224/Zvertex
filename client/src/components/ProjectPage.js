import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function ProjectPage({ user }) {
  const history = useHistory();
  const location = useLocation();
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  const handleJoin = () => {
    if (user) {
      history.push('/dashboard'); // Redirect to project enrollment in dashboard
    } else {
      history.push('/register');
    }
  };

  // Determine project details based on URL
  const projectType = location.pathname.split('/').pop();
  let projectDetails;
  switch (projectType) {
    case 'saas':
      projectDetails = {
        title: 'SaaS Solutions',
        description: 'Build scalable, user-friendly SaaS platforms that empower businesses.',
        useCase: 'Anna developed a subscription-based HR tool, gaining experience in React and Node.js. Subscribe to join SaaS projects!',
      };
      break;
    case 'cloud':
      projectDetails = {
        title: 'Cloud Migration',
        description: 'Help companies transition to secure, efficient cloud infrastructures.',
        useCase: 'Mark migrated a legacy system to AWS, earning a cloud certification. Subscribe to work on cloud projects!',
      };
      break;
    case 'ai':
      projectDetails = {
        title: 'AI Automation',
        description: 'Create AI-driven automation tools to streamline business processes.',
        useCase: 'Lisa built a chatbot with TensorFlow, boosting her AI portfolio. Subscribe to join AI automation projects!',
      };
      break;
    case 'bigdata':
      projectDetails = {
        title: 'Big Data Analytics',
        description: 'Analyze massive datasets to uncover actionable insights for clients.',
        useCase: 'Tom worked on a Hadoop-based analytics project, landing a data scientist role. Subscribe to join big data projects!',
      };
      break;
    case 'devops':
      projectDetails = {
        title: 'DevOps Integration',
        description: 'Optimize CI/CD pipelines and infrastructure for seamless deployments.',
        useCase: 'Rachel set up a Kubernetes cluster, enhancing her DevOps skills. Subscribe to join DevOps projects!',
      };
      break;
    default:
      projectDetails = { title: 'Unknown Project', description: 'Join our exciting projects!', useCase: '' };
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
              JOIN OUR PROJECTS
            </Button>
            <Menu
              anchorEl={projectsAnchor}
              open={Boolean(projectsAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}
            >
              <MenuItem onClick={() => { handleClose(); history.push(user ? '/projects/saas' : '/register'); }}>SaaS Solutions</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push(user ? '/projects/cloud' : '/register'); }}>Cloud Migration</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push(user ? '/projects/ai' : '/register'); }}>AI Automation</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push(user ? '/projects/bigdata' : '/register'); }}>Big Data Analytics</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push(user ? '/projects/devops' : '/register'); }}>DevOps Integration</MenuItem>
            </Menu>
            {!user && (
              <>
                <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
                <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
              </>
            )}
            {user && (
              <Button
                color="inherit"
                onClick={() => {
                  localStorage.removeItem('token');
                  history.push('/');
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
          {projectDetails.title}
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 6, color: '#b0b0b0' }}>
          Collaborate with experts on cutting-edge projects and build your career.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '15px',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  About {projectDetails.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {projectDetails.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic', color: '#00e676' }}>
                  {projectDetails.useCase}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={handleJoin}
                >
                  {user ? 'Join Project' : 'Subscribe to Join'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Ready to Build the Future?
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px', px: 4, py: 1.5 }}
            onClick={handleJoin}
          >
            {user ? 'Get Started' : 'Subscribe Now'}
          </Button>
        </Box>
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
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/why-us')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Address: 5900 BALCONES DR #16790, AUSTIN, TX 78731</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Phone: 737-239-0920</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#ff6d00' } }} onClick={() => history.push('/contact')}>
                Email Us
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>© 2025 ZvertexAI. All rights reserved.</Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default ProjectPage;