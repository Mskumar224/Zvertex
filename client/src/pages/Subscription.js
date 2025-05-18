import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import SubscriptionCard from '../components/SubscriptionCard';

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
      const redirectMap = {
        STUDENT: '/student-dashboard',
        RECRUITER: '/recruiter-dashboard',
        BUSINESS: '/business-dashboard',
      };
      history.push(redirectMap[plan.title]);
    } catch (err) {
      alert(err.response?.data?.error || 'Subscription failed!');
    }
  };

  return (
    <Container sx={{ py: 8, background: '#f5f5f5' }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        Choose Your Subscription
      </Typography>
      <Typography align="center" sx={{ mb: 5, color: '#616161' }}>
        Select a plan tailored to your career or business needs.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item key={plan.title}>
            <SubscriptionCard
              title={plan.title}
              price={plan.price}
              resumes={plan.resumes}
              submissions={plan.submissions}
              description={plan.description}
              onSelect={() => handleSubscription(plan)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Subscription;