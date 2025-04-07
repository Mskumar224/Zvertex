import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AIProjects({ user }) {
  const history = useHistory();

  if (!user) {
    history.push('/login');
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => history.goBack()}
          sx={{ mt: 2, color: '#ff6d00' }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ mt: 4, mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          In-house AI Projects
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Best Use Case</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Contribute to groundbreaking projects in AI, Cloud, and SaaS. From automating workflows to scaling infrastructure, 
                  our in-house initiatives offer real-world impact and learning opportunities.
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>For Contributors</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  - Gain hands-on experience with cutting-edge tech.<br/>
                  - Collaborate with a talented team.<br/>
                  - Build a portfolio of impactful projects.
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>For Businesses</Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  - Access innovative AI solutions.<br/>
                  - Partner on custom projects.<br/>
                  - Scale with our expertise in SaaS and Cloud.
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px' }} 
                  onClick={() => history.push('/contact')}
                >
                  Contact Us to Join
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', textAlign: 'center', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>ZvertexAI</Typography>
              <Typography variant="body2">
                Empowering careers and businesses with AI-driven solutions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Quick Links</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Contact</Typography>
              <Typography variant="body2">5900 Balcones Dr #16790, Austin, TX 78731</Typography>
              <Typography variant="body2">Phone: 737-239-0920 (151)</Typography>
              <Typography variant="body2">Email: support@zvertexai.com</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, backgroundColor: '#fff' }} />
          <Typography variant="body2">
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default AIProjects;