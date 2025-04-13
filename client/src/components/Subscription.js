import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, CircularProgress, Alert } from '@mui/material';
import BackButton from './BackButton';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

function CheckoutForm({ user, setUser }) {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';
  const plan = 'price_1N3X4ZyourStripePriceId'; // Replace with your Stripe price ID

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!stripe || !elements) {
        throw new Error('Stripe.js has not loaded');
      }
      const cardElement = elements.getElement(CardElement);
      const { token, error: stripeError } = await stripe.createToken(cardElement);
      if (stripeError) {
        throw new Error(stripeError.message);
      }
      const res = await axios.post(
        `${apiUrl}/api/auth/subscribe`,
        { token: token.id, plan },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setSuccess('Subscription successful!');
      setUser({ ...user, subscriptionStatus: 'ACTIVE', subscriptionPlan: plan });
      setTimeout(() => history.push('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <CardElement options={{ style: { base: { color: 'white' } } }} />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading || !stripe}
        sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Subscribe'}
      </Button>
    </Box>
  );
}

function Subscription({ user, setUser }) {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <BackButton />
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Subscription
          </Typography>
        </Box>
        <Elements stripe={stripePromise}>
          <CheckoutForm user={user} setUser={setUser} />
        </Elements>
      </Container>
    </Box>
  );
}

export default Subscription;