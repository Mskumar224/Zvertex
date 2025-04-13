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
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

function WhyZvertexAI({ user }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Why Choose ZvertexAI?
          </Typography>
          <Box>
            {user ? (
              <Button
                variant="outlined"
                sx={{ borderColor: '#00e676', color: '#00e676', '&:hover': { backgroundColor: 'rgba(0,230,118,0.1)' } }}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: '#00e676', '&:hover': { backgroundColor: '#00c853' } }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Empowering your career with cutting-edge AI and personalized support.
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
            onClick={() => navigate('/register')}
          >
            Join Now
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <VerifiedIcon sx={{ fontSize: 60, color: '#00e676', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Proven Results
                </Typography>
                <Typography>
                  Our AI-driven job matching has helped thousands land roles at top companies.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SpeedIcon sx={{ fontSize: 60, color: '#00e676', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Fast & Efficient
                </Typography>
                <Typography>
                  Auto-apply to jobs and get real-time updates to save you time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SupportAgentIcon sx={{ fontSize: 60, color: '#00e676', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Dedicated Support
                </Typography>
                <Typography>
                  24/7 assistance from our team to guide you every step of the way.
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

export default WhyZvertexAI;