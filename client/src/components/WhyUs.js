import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function WhyUs({ user }) {
  const history = useHistory();
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  const handleSubscribe = () => {
    if (user) {
      history.push('/dashboard'); // Redirect to subscription management in dashboard (future feature)
    } else {
      history.push('/register');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>
            ZvertexAI
          </Typography>
          <Box>
            <Button color="inherit" onClick={handleServicesClick} endIcon={<ArrowDropDownIcon />}>Services</Button>
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
            <Button color="inherit" onClick={handleProjectsClick} endIcon={<ArrowDropDownIcon />}>JOIN OUR PROJECTS</Button>
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
              <Button color="inherit" onClick={() => { localStorage.removeItem('token'); history.push('/'); }}>Logout</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
          Why Choose ZvertexAI?
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 6, color: '#b0b0b0' }}>
          Unlock your career potential with AI-driven tools and exclusive project opportunities.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '15px',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  AI Job Matching
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Our AI analyzes your resume to match you with top jobs tailored to your skills and experience. Subscribe for unlimited applications and priority matching!
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Use Cases:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#00e676' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Personalized Job Recommendations"
                      secondary="Get job suggestions based on your unique skills, from software engineering to data science."
                      primaryTypographyProps={{ color: 'white' }}
                      secondaryTypographyProps={{ color: '#b0b0b0' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#00e676' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Resume Optimization"
                      secondary="Receive AI-driven tips to improve your resume for specific roles."
                      primaryTypographyProps={{ color: 'white' }}
                      secondaryTypographyProps={{ color: '#b0b0b0' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#00e676' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Priority Applications"
                      secondary="Subscribed users get their applications reviewed faster by top employers."
                      primaryTypographyProps={{ color: 'white' }}
                      secondaryTypographyProps={{ color: '#b0b0b0' }}
                    />
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={handleSubscribe}
                >
                  {user ? 'Upgrade Subscription' : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                borderRadius: '15px',
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  In-house AI Projects
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Collaborate on cutting-edge AI, Cloud, and SaaS projects with our team. Subscribe to access exclusive opportunities and build your portfolio!
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Use Cases:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#00e676' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Real-World AI Development"
                      secondary="Work on projects like AI chatbots or predictive analytics tools."
                      primaryTypographyProps={{ color: 'white' }}
                      secondaryTypographyProps={{ color: '#b0b0b0' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#00e676' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cloud Migration Expertise"
                      secondary="Contribute to enterprise-grade cloud solutions for scalability."
                      primaryTypographyProps={{ color: 'white' }}
                      secondaryTypographyProps={{ color: '#b0b0b0' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#00e676' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Portfolio Boost"
                      secondary="Showcase your work on high-impact projects to future employers."
                      primaryTypographyProps={{ color: 'white' }}
                      secondaryTypographyProps={{ color: '#b0b0b0' }}
                    />
                  </ListItem>
                </List>
                <Button
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={handleSubscribe}
                >
                  {user ? 'Join Projects' : 'Subscribe Now'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            Ready to Transform Your Career?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: '#b0b0b0', maxWidth: '600px', mx: 'auto' }}>
            Subscribe to ZvertexAI to access AI-driven job matching, exclusive projects, and ZGPT—your personal career copilot.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px', px: 4, py: 1.5 }}
            onClick={handleSubscribe}
          >
            {user ? 'Explore Subscription' : 'Get Started Now'}
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

export default WhyUs;