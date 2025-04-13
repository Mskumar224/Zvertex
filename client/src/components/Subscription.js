import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Typography, Button, Container, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function SubscriptionForm({ user, setUser }) {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(user.subscriptionType || 'STUDENT');

  const plans = [
    { type: 'STUDENT', price: 69.99, features: ['Job Matching', 'Resume Parsing', 'Auto-Apply'] },
    { type: 'RECRUITER', price: 149.99, features: ['Candidate Matching', 'Profile Access', 'Job Posting'] },
    { type: 'BUSINESS', price: 249.99, features: ['Analytics Dashboard', 'Team Management', 'Priority Support'] },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { data: { clientSecret } } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/subscribe`,
        { subscriptionType: selectedPlan },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/confirm-subscription`,
          { paymentIntentId: result.paymentIntent.id },
          { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );
        setUser(res.data);
        history.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
          Choose Your Subscription
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
        <Grid container spacing={4}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={4} key={plan.type}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h5">{plan.type}</Typography>
                  <Typography variant="h6" sx={{ my: 2 }}>${plan.price}/month</Typography>
                  <Typography variant="body2">4-Day Free Trial</Typography>
                  <Box sx={{ my: 2 }}>
                    {plan.features.map((feature, index) => (
                      <Typography key={index} variant="body2">{feature}</Typography>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: selectedPlan === plan.type ? '#ff6d00' : '#666', '&:hover': { backgroundColor: '#e65100' } }}
                    onClick={() => setSelectedPlan(plan.type)}
                  >
                    {selectedPlan === plan.type ? 'Selected' : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px' }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Payment Details
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <CardElement
              options={{
                style: {
                  base: { color: 'white', '::placeholder': { color: '#aaa' } },
                  invalid: { color: '#ff6d00' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!stripe || loading}
              sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Subscribe'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function Subscription({ user, setUser }) {
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionForm user={user} setUser={setUser} />
    </Elements>
  );
}

export default Subscription;