import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Projects({ user }) {
  const history = useHistory();
  const projects = [
    {
      title: 'SaaS Solutions',
      description:
        'Build scalable, AI-driven SaaS platforms for businesses. Ideal for streamlining operations and enhancing user experiences.',
      useCase:
        'Develop a customer service chatbot that reduces response times by 70%, helping businesses scale efficiently.',
      clientReason: 'Clients gain cost-effective, customizable solutions to boost productivity and customer satisfaction.',
      userReason: 'Users enhance their skills in full-stack development and AI integration, working on real-world applications.',
      path: '/project-saas',
    },
    {
      title: 'Cloud Migration',
      description:
        'Migrate legacy systems to secure, scalable cloud environments with minimal downtime.',
      useCase:
        'Transition a retail company’s inventory system to AWS, cutting operational costs by 30% and improving uptime.',
      clientReason: 'Clients benefit from reduced infrastructure costs and enhanced system reliability.',
      userReason: 'Users gain expertise in AWS, Azure, and Kubernetes, preparing for high-demand cloud roles.',
      path: '/project-cloud',
    },
    {
      title: 'AI Automation',
      description:
        'Automate workflows with AI, from data processing to predictive analytics, transforming business operations.',
      useCase:
        'Automate financial forecasting for a fintech firm, improving accuracy by 40% with machine learning models.',
      clientReason: 'Clients see increased efficiency and data-driven decision-making.',
      userReason: 'Users master TensorFlow and PyTorch, building portfolios with impactful AI projects.',
      path: '/project-ai',
    },
    {
      title: 'Big Data Analytics',
      description:
        'Harness big data to uncover insights, optimize strategies, and drive innovation.',
      useCase:
        'Analyze customer behavior for an e-commerce platform, boosting sales by 25% through targeted campaigns.',
      clientReason: 'Clients gain actionable insights to stay ahead of competitors.',
      userReason: 'Users learn Spark and Hadoop, tackling large-scale data challenges.',
      path: '/project-bigdata',
    },
    {
      title: 'DevOps Integration',
      description:
        'Streamline development pipelines with CI/CD, containerization, and infrastructure as code.',
      useCase:
        'Implement a CI/CD pipeline for a startup, reducing deployment time from days to hours.',
      clientReason: 'Clients achieve faster releases and higher software quality.',
      userReason: 'Users become proficient in Docker, Jenkins, and Terraform, boosting career prospects.',
      path: '/project-devops',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg" sx={{ pt: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => history.push('/')} sx={{ color: '#ff6d00' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Our Projects
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Collaborate with ZvertexAI on innovative projects that redefine industries. Whether you're a client seeking solutions or a contributor building skills, there’s a place for you.
        </Typography>
        <Grid container spacing={4}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} key={project.title}>
              <Card
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderRadius: '15px',
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
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Use Case:</strong> {project.useCase}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>For Clients:</strong> {project.clientReason}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>For Contributors:</strong> {project.userReason}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#ff6d00',
                      '&:hover': { backgroundColor: '#e65100' },
                      mr: 2,
                    }}
                    onClick={() => history.push(project.path)}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ color: '#ff6d00', borderColor: '#ff6d00' }}
                    onClick={() => history.push('/contact')}
                  >
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ready to Join Our Mission?
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#ff6d00',
              '&:hover': { backgroundColor: '#e65100' },
            }}
            onClick={() => history.push(user ? '/dashboard' : '/register')}
          >
            {user ? 'Go to Dashboard' : 'Start Free Trial'}
          </Button>
        </Box>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                Pioneering AI-driven solutions for job seekers and innovators. Join us to shape the future of work.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact Us
              </Typography>
              <Typography variant="body2">
                Address: 5900 BALCONES DR #16790, AUSTIN, TX 78731
                <br />
                Phone: 737-239-0920
                <br />
                Email: zvertexai@honotech.com
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              <Box>
                <Button color="inherit" onClick={() => history.push('/why-zvertex')}>
                  Why ZvertexAI?
                </Button>
                <br />
                <Button color="inherit" onClick={() => history.push('/faqs')}>
                  Interview FAQs
                </Button>
                <br />
                <Button color="inherit" onClick={() => history.push('/contact')}>
                  Contact
                </Button>
              </Box>
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

export default Projects;