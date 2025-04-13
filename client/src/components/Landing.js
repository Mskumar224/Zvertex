import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import SupportIcon from '@mui/icons-material/Support';

function Landing({ user, handleLogout }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            ZvertexAI
          </Typography>
          <Box>
            <Button
              sx={{ color: 'white', mr: 2 }}
              onClick={() => navigate('/why-us')}
            >
              Why Us
            </Button>
            <Button
              sx={{ color: 'white', mr: 2 }}
              onClick={() => navigate('/faq')}
            >
              FAQs
            </Button>
            <Button
              sx={{ color: 'white', mr: 2 }}
              onClick={() => navigate('/projects')}
            >
              Projects
            </Button>
            <Button
              sx={{ color: 'white', mr: 2 }}
              onClick={() => navigate('/contact')}
            >
              Contact
            </Button>
            {user ? (
              <>
                <Button
                  variant="contained"
                  sx={{ mr: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outlined"
                  sx={{ borderColor: '#00e676', color: '#00e676', '&:hover': { backgroundColor: 'rgba(0,230,118,0.1)' } }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={{ mr: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#00e676', '&:hover': { backgroundColor: '#00c853' } }}
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Your Career, Powered by AI
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            ZvertexAI helps you land your dream job with AI-driven job matching, resume optimization, and career coaching.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
            onClick={() => navigate(user ? '/dashboard' : '/register')}
          >
            Get Started
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <WorkIcon sx={{ fontSize: 60, color: '#00e676', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Job Matching
                </Typography>
                <Typography>
                  Our AI finds jobs tailored to your skills and preferences, with real-time updates from top job boards.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 60, color: '#00e676', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Career Coaching
                </Typography>
                <Typography>
                  Get personalized resume feedback and interview tips from ZGPT, our AI career copilot.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SupportIcon sx={{ fontSize: 60, color: '#00e676', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  24/7 Support
                </Typography>
                <Typography>
                  Our team is here to help with any questions, from job applications to technical support.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
          © 2025 ZvertexAI. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Landing;