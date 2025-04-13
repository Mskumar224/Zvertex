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

function ProjectAI({ user }) {
  const history = useHistory();

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
          AI Automation Project
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Develop Intelligent AI Solutions
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Join our AI project to build automation tools using TensorFlow, PyTorch, and Python. Create
              intelligent systems for job matching, chatbots, and more.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Technologies:</strong> TensorFlow, PyTorch, Python, Scikit-learn, Pandas, NLP
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Skills Gained:</strong> Machine learning, deep learning, data processing, model deployment
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: '#1e1e1e', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Why Join?
                </Typography>
                <Typography variant="body2">
                  - Work on cutting-edge AI models<br />
                  - Gain expertise in ML frameworks<br />
                  - Stand out in the AI job market
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: '#1e1e1e', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Get Started
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Subscribe to any plan to join our projects and start building today!
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => history.push(user ? '/dashboard' : '/register')}
                  sx={{
                    backgroundColor: '#ff6d00',
                    '&:hover': { backgroundColor: '#e65100' },
                    borderRadius: '10px',
                  }}
                >
                  {user ? 'Go to Dashboard' : 'Join Now'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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

export default ProjectAI;