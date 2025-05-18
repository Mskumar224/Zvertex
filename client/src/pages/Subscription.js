import React from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import BackButton from '../components/BackButton';

function Subscription() {
  const history = useHistory();

  const plans = [
    { title: 'STUDENT', price: 0, resumes: 1, submissions: 45, description: 'Perfect for students starting their career.' },
    { title: 'RECRUITER', price: 0, resumes: 5, submissions: 45, description: 'Ideal for recruiters managing multiple profiles.' },
    { title: 'BUSINESS', price: 0, resumes: 3, submissions: 145, description: 'Designed for businesses hiring at scale.' },
  ];

  const handleSubscription = async (plan) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { plan: plan.title },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      history.push('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Subscription failed!');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <BackButton />
        <Typography variant="h3" align="center" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
          Choose Your ZvertexAI Subscription
        </Typography>
        <Typography align="center" sx={{ mb: 5, color: 'white' }}>
          Select a plan tailored to your career or business needs.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid item key={plan.title} xs={12} sm={4}>
              <Box sx={{ background: 'white', borderRadius: 2, boxShadow: 3, p: 3, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: '#1a2a44', fontWeight: 'bold' }}>{plan.title}</Typography>
                <Typography variant="h4" sx={{ my: 2, color: '#1a2a44' }}>
                  ${plan.price}<Typography component="span" variant="body2">/month</Typography>
                </Typography>
                <Typography sx={{ color: '#1a2a44' }}>{plan.resumes} Resume(s)</Typography>
                <Typography sx={{ color: '#1a2a44' }}>{plan.submissions} Submissions/Day</Typography>
                <Typography sx={{ mt: 2, color: '#757575' }}>{plan.description}</Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 3, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, px: 4 }}
                  onClick={() => handleSubscription(plan)}
                >
                  Choose Plan
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Subscription;