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

function CloudProject({ user }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Cloud Computing Project
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
                  Our Cloud Computing project delivers scalable, secure, and cost-effective cloud solutions using AWS, Azure,
                  and Google Cloud. We specialize in cloud migration, serverless architectures, and multi-cloud strategies.
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
                  - Serverless computing with AWS Lambda<br />
                  - Kubernetes-based container orchestration<br />
                  - Automated cloud security audits<br />
                  - Multi-cloud redundancy
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
                  - AWS, Azure, Google Cloud<br />
                  - Docker, Kubernetes<br />
                  - Terraform, Ansible<br />
                  - CloudFormation
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
                  Want to build cloud-native solutions? Reach out to collaborate or explore our cloud career tools.
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

export default CloudProject;