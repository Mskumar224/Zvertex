import React, { useState } from 'react';
import { Container, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import axios from 'axios';

function Subscription() {
  const [plan, setPlan] = useState('');

  const plans = [
    { name: 'STUDENT', price: 'Contact for pricing', limit: 45, desc: 'Perfect for students starting their career' },
    { name: 'RECRUITER', price: 'Contact for pricing', limit: 225, desc: 'Manage up to 5 profiles effortlessly' },
    { name: 'BUSINESS', price: 'Contact for pricing', limit: 675, desc: 'Scale hiring with 3 recruiters' },
  ];

  const handleSubscribe = async (selectedPlan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { plan: selectedPlan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlan(selectedPlan);
      alert(`Subscribed to ${selectedPlan} plan!`);
      window.location.href = data.redirect;
    } catch (err) {
      console.error('Subscription failed:', err);
      alert('Subscription failed: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        sx={{ color: '#1976d2', mb: 4, textAlign: 'center', cursor: 'pointer' }}
        onClick={() => window.location.href = '/'}
      >
        ZvertexAI - Choose Your Subscription
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {plans.map((p) => (
          <Card key={p.name} sx={{ width: 250, m: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#1976d2' }}>{p.name}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{p.price}</Typography>
              <Typography>Up to {p.limit} submissions/day</Typography>
              <Typography sx={{ mt: 1, color: '#6B7280' }}>{p.desc}</Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ borderRadius: '25px' }}
                onClick={() => handleSubscribe(p.name)}
                disabled={plan === p.name}
              >
                {plan === p.name ? 'Subscribed' : 'Subscribe'}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
      <Typography sx={{ mt: 4, textAlign: 'center', color: '#6B7280' }}>
        For pricing details, visit <a href="https://x.ai/grok" style={{ color: '#1976d2' }}>x.ai/grok</a>.
      </Typography>
    </Container>
  );
}

export default Subscription;