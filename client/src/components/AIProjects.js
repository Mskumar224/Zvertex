import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AIProjects({ user }) {
  const history = useHistory();
  const projects = [
    { name: 'SaaS Solutions', path: '/projects/saas', description: 'Build scalable cloud-native applications.' },
    { name: 'Cloud Migration', path: '/projects/cloud', description: 'Modernize infrastructure with AWS, Azure, GCP.' },
    { name: 'AI Automation', path: '/projects/ai', description: 'Develop intelligent systems with ML.' },
    { name: 'Big Data Analytics', path: '/projects/bigdata', description: 'Analyze massive datasets with Spark.' },
    { name: 'DevOps Integration', path: '/projects/devops', description: 'Streamline development with CI/CD.' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', py: 4 }}>
      <Container maxWidth="lg">
        <IconButton
          onClick={() => history.push(user ? '/dashboard' : '/')}
          sx={{ color: 'white', mb: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          In-House AI Projects
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
          Collaborate on cutting-edge projects in SaaS, Cloud, AI, Big Data, and DevOps to build skills and
          boost your career.
        </Typography>
        <Grid container spacing={4}>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: '#1e1e1e',
                  color: 'white',
                  borderRadius: '15px',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => history.push(project.path)}
                    sx={{
                      backgroundColor: '#ff6d00',
                      '&:hover': { backgroundColor: '#e65100' },
                      borderRadius: '10px',
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            onClick={() => history.push(user ? '/dashboard' : '/register')}
            sx={{
              backgroundColor: '#00e676',
              '&:hover': { backgroundColor: '#00c853' },
              borderRadius: '25px',
              px: 4,
              py: 1.5,
            }}
          >
            {user ? 'Go to Dashboard' : 'Join Projects Now'}
          </Button>
        </Box>
      </Container>
      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                ZvertexAI empowers careers with AI-driven job matching, innovative projects, and ZGPT, your
                personal copilot. Join us to unlock your potential.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Links
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/faq')}
              >
                Interview FAQs
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/why-us')}
              >
                Why ZvertexAI?
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/zgpt')}
              >
                ZGPT Copilot
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/contact')}
              >
                Contact Us
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default AIProjects;