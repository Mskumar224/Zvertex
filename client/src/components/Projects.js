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
  CardActions,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import CloudIcon from '@mui/icons-material/Cloud';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';

function Projects({ user }) {
  const navigate = useNavigate();

  const projects = [
    {
      title: 'SaaS Development',
      description: 'Building scalable software-as-a-service platforms with modern frameworks.',
      icon: <CodeIcon sx={{ fontSize: 60, color: '#00e676' }} />,
      path: '/projects/saas',
    },
    {
      title: 'Cloud Computing',
      description: 'Deploying secure and efficient cloud solutions across AWS, Azure, and GCP.',
      icon: <CloudIcon sx={{ fontSize: 60, color: '#00e676' }} />,
      path: '/projects/cloud',
    },
    {
      title: 'AI & Machine Learning',
      description: 'Developing intelligent systems for predictive analytics and automation.',
      icon: <AutoAwesomeIcon sx={{ fontSize: 60, color: '#00e676' }} />,
      path: '/projects/ai',
    },
    {
      title: 'Big Data Analytics',
      description: 'Processing massive datasets to deliver actionable business insights.',
      icon: <StorageIcon sx={{ fontSize: 60, color: '#00e676' }} />,
      path: '/projects/bigdata',
    },
    {
      title: 'DevOps Automation',
      description: 'Streamlining CI/CD pipelines and infrastructure as code.',
      icon: <BuildIcon sx={{ fontSize: 60, color: '#00e676' }} />,
      path: '/projects/devops',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Our Projects
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

        <Grid container spacing={4}>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  {project.icon}
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    {project.title}
                  </Typography>
                  <Typography>
                    {project.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                    onClick={() => navigate(project.path)}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
          © 2025 ZvertexAI. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Projects;