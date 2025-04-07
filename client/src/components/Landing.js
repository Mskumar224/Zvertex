import React, { useState } from 'react';
import { 
  Box, Typography, Button, AppBar, Toolbar, Menu, MenuItem, 
  Container, Grid, Card, CardContent, TextField 
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Landing() {
  const history = useHistory();
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  const handleSearch = () => {
    if (jobTitle.trim() && location.trim()) {
      const token = localStorage.getItem('token');
      history.push(token ? '/dashboard' : '/register');
    } else {
      alert('Enter Job Title and Location to unlock premium job search! Subscribe now for full access.');
    }
  };

  const handleGetStarted = () => {
    history.push('/register');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      {/* Header */}
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
              <MenuItem onClick={() => { handleClose(); history.push('/contact'); }}>
                Contact Us
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/faq'); }}>
                Interview FAQs
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/why-us'); }}>
                Why ZvertexAI?
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/zgpt'); }}>
                Zgpt - Your Copilot (Subscribe for Full Access!)
              </MenuItem>
            </Menu>
            <Button color="inherit" onClick={handleProjectsClick} endIcon={<ArrowDropDownIcon />}>
              Join Our Projects!
            </Button>
            <Menu
              anchorEl={projectsAnchor}
              open={Boolean(projectsAnchor)}
              onClose={handleClose}
              PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}
            >
              <MenuItem onClick={() => { handleClose(); history.push('/projects/saas'); }}>
                SaaS Solutions (AI-Driven Tools Await!)
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/cloud'); }}>
                Cloud Migration (Scale with Us!)
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/ai'); }}>
                AI Automation (Unlock Premium Features!)
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/bigdata'); }}>
                Big Data Analytics (Subscribe to Explore!)
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/projects/devops'); }}>
                DevOps Integration (Join Our Ecosystem!)
              </MenuItem>
            </Menu>
            <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
            <Button color="inherit" onClick={() => history.push('/register')}>Register</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Elevate Your Career with ZvertexAI
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              AI-powered job applications, projects, and your copilot Zgpt.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ 
                backgroundColor: '#ff6d00', 
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                px: 4,
                py: 1.5
              }}
              onClick={handleGetStarted}
            >
              Get Started Now
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              borderRadius: '15px', 
              p: 3, 
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)' 
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Search Your Dream Job Here
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Discover your next opportunity with AI-driven tools.
              </Typography>
              <TextField
                label="Enter Job Title, Skills"
                fullWidth
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                sx={{ 
                  mb: 2, 
                  input: { color: 'white' }, 
                  label: { color: 'white' }, 
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } 
                }}
              />
              <TextField
                label="Enter Location (Zip, City, State)"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{ 
                  mb: 3, 
                  input: { color: 'white' }, 
                  label: { color: 'white' }, 
                  '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } 
                }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#ff6d00',
                  '&:hover': { backgroundColor: '#e65100' },
                  borderRadius: '25px',
                  py: 1.5
                }}
                onClick={handleSearch}
              >
                Find Jobs
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
            Why Choose ZvertexAI?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                color: 'white', 
                borderRadius: '15px', 
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>AI Job Matching</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Smart resume analysis and job applications. Subscribe for unlimited submissions!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                color: 'white', 
                borderRadius: '15px', 
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>In-house AI Projects</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Explore our AI + Cloud + SaaS solutions. Join now to contribute!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ 
                backgroundColor: '#212121', // ChatGPT-like dark background
                color: 'white', 
                borderRadius: '15px', 
                height: '100%',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Zgpt Copilot
                  </Typography>
                  <Box sx={{ backgroundColor: '#303030', p: 2, borderRadius: '10px', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      You: "What’s the future of AI?"
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#00e676', mt: 1 }}>
                      Zgpt: "AI will revolutionize jobs—subscribe to see how!"
                    </Typography>
                  </Box>
                  <TextField
                    placeholder="Try me..."
                    fullWidth
                    disabled
                    sx={{ 
                      mb: 2, 
                      input: { color: 'white' }, 
                      '& .MuiInputBase-root': { backgroundColor: '#424242', borderRadius: '20px' },
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                  />
                  <Button 
                    variant="contained" 
                    sx={{ backgroundColor: '#00e676', '&:hover': { backgroundColor: '#00c853' } }} 
                    onClick={() => history.push('/zgpt')}
                  >
                    Chat with Zgpt
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 3, backgroundColor: '#1a2a44', textAlign: 'center' }}>
        <Typography variant="body2">
          © 2025 ZvertexAI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default Landing;