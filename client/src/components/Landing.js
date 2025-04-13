import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Landing({ user, setSidebarOpen }) {
  const history = useHistory();
  const [showVideo, setShowVideo] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      history.push('/dashboard');
    } else {
      history.push('/register');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white' }}>
      {user && (
        <IconButton
          onClick={() => setSidebarOpen(true)}
          sx={{ color: 'white', position: 'fixed', top: 16, left: 16 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: 'linear-gradient(45deg, #121212, #1e1e1e)',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '2rem', md: '3.5rem' } }}
          >
            Welcome to ZvertexAI
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, color: '#b0bec5' }}>
            Your AI-powered career companion for job matching, automation, and hands-on projects.
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                px: 4,
                py: 1.5,
                mr: 2,
              }}
              onClick={handleGetStarted}
            >
              {user ? 'Go to Dashboard' : 'Get Started'}
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#00e676',
                color: '#00e676',
                '&:hover': { borderColor: '#00c853', color: '#00c853' },
                borderRadius: '25px',
                px: 4,
                py: 1.5,
              }}
              onClick={() => setShowVideo(!showVideo)}
            >
              {showVideo ? 'Hide Video' : 'Watch Video'}
            </Button>
          </Box>
          {showVideo && (
            <Box sx={{ maxWidth: '100%', height: 'auto' }}>
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="ZvertexAI Intro"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </Box>
          )}
        </Container>
      </Box>
      <Box sx={{ py: 8, backgroundColor: '#1e1e1e' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
            Why ZvertexAI?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                AI Job Matching
              </Typography>
              <Typography>
                Matches your resume to jobs using 60+ technologies for precise opportunities.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Automation
              </Typography>
              <Typography>
                Auto-apply to jobs every 30 minutes, streamlining your job search.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Projects
              </Typography>
              <Typography>
                Build skills with SaaS, Cloud, AI, Big Data, and DevOps projects.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
            Subscription Plans
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 4,
                  backgroundColor: '#263238',
                  borderRadius: '15px',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Student
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Perfect for individuals starting their career.
                </Typography>
                <Typography sx={{ mb: 2 }}>$10/month after 7-day trial</Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#00e676',
                    '&:hover': { backgroundColor: '#00c853' },
                    borderRadius: '25px',
                  }}
                  onClick={() => history.push('/register')}
                >
                  Try for Free
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 4,
                  backgroundColor: '#263238',
                  borderRadius: '15px',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Recruiter
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Manage up to 5 candidate profiles.
                </Typography>
                <Typography sx={{ mb: 2 }}>$50/month after 7-day trial</Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#00e676',
                    '&:hover': { backgroundColor: '#00c853' },
                    borderRadius: '25px',
                  }}
                  onClick={() => history.push('/register')}
                >
                  Try for Free
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  p: 4,
                  backgroundColor: '#263238',
                  borderRadius: '15px',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Business
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Oversee 3 recruiters for your company.
                </Typography>
                <Typography sx={{ mb: 2 }}>$100/month after 7-day trial</Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#00e676',
                    '&:hover': { backgroundColor: '#00c853' },
                    borderRadius: '25px',
                  }}
                  onClick={() => history.push('/register')}
                >
                  Try for Free
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ py: 4, backgroundColor: '#1a2a44' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                About ZvertexAI
              </Typography>
              <Typography>
                Empowering careers with AI-driven job matching and innovative projects.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Links
              </Typography>
              <Typography sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                Why ZvertexAI?
              </Typography>
              <Typography sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
              <Typography sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                Contact Us
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Info
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography sx={{ mb: 1 }}>Phone: (737) 239-0920</Typography>
              <Typography sx={{ mb: 1 }}>Email: support@zvertexai.com</Typography>
            </Grid>
          </Grid>
          <Typography sx={{ mt: 4, textAlign: 'center' }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;