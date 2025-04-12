import React from 'react';
import { Box, Typography, Container, Grid, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

function Projects() {
  const history = useHistory();
  const projects = [
    { title: 'SaaS Solutions', path: '/saas-project' },
    { title: 'Cloud Computing', path: '/cloud-project' },
    { title: 'AI Innovations', path: '/ai-project' },
    { title: 'Big Data Analytics', path: '/bigdata-project' },
    { title: 'DevOps Automation', path: '/devops-project' },
  ];

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      color: 'white',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Our Projects
          </Typography>
          <Grid container spacing={3}>
            {projects.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  p: 3,
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}>
                  <Typography variant="h6" sx={{ color: '#00e676', mb: 2 }}>
                    {project.title}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#ff6d00',
                      '&:hover': { backgroundColor: '#e65100' },
                      borderRadius: '25px',
                      py: 1,
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => history.push(project.path)}
                  >
                    Learn More
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Projects;