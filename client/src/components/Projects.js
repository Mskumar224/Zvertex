import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';

function Projects({ user }) {
  const history = useHistory();

  const projects = [
    { title: 'SaaS Solutions', path: '/projects/saas', description: 'Scalable software for modern businesses.' },
    { title: 'Cloud Migration', path: '/projects/cloud', description: 'Seamless transitions to cloud platforms.' },
    { title: 'AI Automation', path: '/projects/ai', description: 'Intelligent systems for efficiency.' },
    { title: 'Big Data Analytics', path: '/projects/bigdata', description: 'Actionable insights from massive datasets.' },
    { title: 'DevOps Integration', path: '/projects/devops', description: 'Streamlined development and operations.' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            variant="text"
            sx={{ mb: 2, color: '#00e676', alignSelf: 'flex-start' }}
            onClick={() => history.push('/')}
          >
            Back to Home
          </Button>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#ff6d00' }}>
            Our Projects
          </Typography>
          <Grid container spacing={4}>
            {projects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {project.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ color: '#00e676', borderColor: '#00e676' }}
                      onClick={() => history.push(user ? project.path : '/register')}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Box sx={{
        py: 4,
        backgroundColor: '#1a2a44',
        color: 'white',
        textAlign: 'center',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                Empowering careers with AI-driven job matching, innovative projects, and ZGPT copilot.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" onClick={() => history.push('/faq')}>Interview FAQs</Button>
                <Button color="inherit" onClick={() => history.push('/why-us')}>Why ZvertexAI?</Button>
                <Button color="inherit" onClick={() => history.push('/projects')}>Our Projects</Button>
                <Button color="inherit" onClick={() => history.push('/contact-us')}>Contact Us</Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2">
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4 }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Projects;