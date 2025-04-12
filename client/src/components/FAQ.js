import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, AppBar, Toolbar, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Faq({ user }) {
  const history = useHistory();
  const [servicesAnchor, setServicesAnchor] = useState(null);
  const [projectsAnchor, setProjectsAnchor] = useState(null);

  const handleServicesClick = (event) => setServicesAnchor(event.currentTarget);
  const handleProjectsClick = (event) => setProjectsAnchor(event.currentTarget);
  const handleClose = () => {
    setServicesAnchor(null);
    setProjectsAnchor(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => history.push('/')}>ZvertexAI</Typography>
          <Box>
            <Button color="inherit" onClick={handleServicesClick} endIcon={<ArrowDropDownIcon />}>Services</Button>
            <Menu anchorEl={servicesAnchor} open={Boolean(servicesAnchor)} onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}>
              <MenuItem onClick={() => { handleClose(); history.push('/faq'); }}>Interview FAQs</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/why-us'); }}>Why ZvertexAI?</MenuItem>
              <MenuItem onClick={() => { handleClose(); history.push('/zgpt'); }}>ZGPT - Your Copilot</MenuItem>
            </Menu>
            <Button color="inherit" onClick={handleProjectsClick} endIcon={<ArrowDropDownIcon />}>JOIN OUR PROJECTS</Button>
            <Menu anchorEl={projectsAnchor} open={Boolean(projectsAnchor)} onClose={handleClose} PaperProps={{ sx: { backgroundColor: '#1a2a44', color: 'white' } }}>
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

      <Container maxWidth="lg" sx={{ pt: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Interview FAQs</Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#b0b0b0' }}>
          Coming soon! Stay with ZvertexAI to unlock AI-powered tools that simplify your job search and prepare you for success.
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }} onClick={() => history.push('/')}>
          Back to Home
        </Button>
      </Container>
    </Box>
  );
}

export default Faq;