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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function SaasProject({ user }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            SaaS Development Project
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              sx={{ mr: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </Button>
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

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Overview
                </Typography>
                <Typography>
                  Our SaaS Development project focuses on building scalable, user-friendly platforms with subscription-based
                  models. We prioritize performance, security, and seamless user experiences for startups and enterprises.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Key Features
                </Typography>
                <Typography>
                  - Multi-tenant architecture<br />
                  - Real-time analytics dashboards<br />
                  - Secure payment integration<br />
                  - Cross-platform compatibility
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Technologies Used
                </Typography>
                <Typography>
                  - React, Node.js<br />
                  - MongoDB, PostgreSQL<br />
                  - AWS, Firebase<br />
                  - Stripe for payments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Get Involved
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Want to build the next big SaaS product? Join our team or explore our career tools.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={() => navigate('/contact')}
                >
                  Contact Us
                </Button>
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

export default SaasProject;