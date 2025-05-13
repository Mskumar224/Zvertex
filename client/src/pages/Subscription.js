import React, { useState } from 'react';
import { Container, Typography, Button, Card, CardContent, CardActions, TextField, Box } from '@mui/material'; // Added Box import
import axios from 'axios';

function Subscription() {
  const [plan, setPlan] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState('select'); // select, otp
  const [error, setError] = useState('');

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
      setUserId(data.userId);
      setPlan(selectedPlan);
      setStep('otp');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Subscription failed');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/subscription/verify-subscription-otp`, { userId, otp });
      alert(`Subscribed to ${plan} plan!`);
      window.location.href = data.redirect;
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
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
      {step === 'select' ? (
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
      ) : (
        <Box sx={{ p: 4, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: 400, mx: 'auto' }}>
          <Typography sx={{ mb: 3, textAlign: 'center' }}>
            An OTP has been sent to zvertex.247@gmail.com for the {plan} plan. Please enter it below.
          </Typography>
          <TextField
            label="OTP"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ mb: 3 }}
            variant="outlined"
            error={!!error && !otp}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleVerifyOtp}
            sx={{ py: 1.5, borderRadius: '25px' }}
          >
            Verify OTP
          </Button>
          {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
        </Box>
      )}
      <Typography sx={{ mt: 4, textAlign: 'center', color: '#6B7280' }}>
        For pricing details, visit <a href="https://x.ai/grok" style={{ color: '#1976d2' }}>x.ai/grok</a>.
      </Typography>
    </Container>
  );
}

export default Subscription;