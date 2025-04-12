import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Faq() {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

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
          <Button sx={{ color: '#ffffff' }} onClick={() => history.push('/')}>
            Home
          </Button>
          <Button sx={{ color: '#ffffff' }} onClick={() => history.push('/login')}>
            Login
          </Button>
          <Button sx={{ color: '#ffffff' }} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Frequently Asked Questions
        </Typography>
        <Accordion sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}>
            <Typography variant="h6">What is ZvertexAI?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              ZvertexAI is an AI-driven platform for job matching, career advice, and cutting-edge projects.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}>
            <Typography variant="h6">How does ZGPT Copilot work?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              ZGPT Copilot provides personalized career advice and job insights using advanced AI technology.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}>
            <Typography variant="h6">What subscriptions are available?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We offer a 7-day free trial, plus Student ($69.99/month), Recruiter ($149.99/month), and Business ($249.99/month) plans.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Button
          variant="contained"
          sx={{ mt: 4, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, display: 'block', mx: 'auto' }}
          onClick={() => history.push('/contact')}
        >
          Contact Us for More Info
        </Button>
      </Container>
    </Box>
  );
}

export default Faq;