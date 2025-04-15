import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, CircularProgress } from '@mui/material';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_public_key');

function SubscriptionForm({ user, setUser }) {
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!stripe || !elements) {
      setError('Stripe not initialized');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${apiUrl}/api/auth/create-subscription`,
        { subscriptionType: user.subscriptionType },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );

      const { clientSecret } = data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        await axios.post(
          `${apiUrl}/api/auth/confirm-subscription`,
          { paymentIntentId: result.paymentIntent.id },
          { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );
        setSuccess('Subscription activated successfully!');
        setUser({ ...user, subscriptionStatus: 'ACTIVE' });
        setTimeout(() => history.push('/dashboard'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px', maxWidth: '500px', mx: 'auto' }}>
      {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
      {success && <Typography sx={{ color: 'white', mb: 2, textAlign: 'center' }}>{success}</Typography>}
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Payment Details
        </Typography>
        <CardElement
          options={{
            style: {
              base: { color: 'white', '::placeholder': { color: '#aab7c4' } },
              invalid: { color: '#ff6d00' },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !stripe}
          sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, mt: 3, py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Subscribe'}
        </Button>
      </Box>
    </Box>
  );
}

function Subscription({ user, setUser }) {
  const history = useHistory();
  const [subscriptionStatus, setSubscriptionStatus] = useState(user.subscriptionStatus || 'TRIAL');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/auth/subscription`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setSubscriptionStatus(res.data.subscriptionStatus);
        setUser({ ...user, subscriptionStatus: res.data.subscriptionStatus });
      } catch (err) {
        console.error('Failed to verify subscription');
      }
    };
    checkSubscription();
  }, [apiUrl, user, setUser]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            Subscription
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', mb: 4 }}>
            Unlock Full Access
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Choose a plan that fits your needs and start your journey with ZvertexAI.
          </Typography>
        </Box>
        {subscriptionStatus === 'ACTIVE' ? (
          <Box sx={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.1)', p: 4, borderRadius: '15px' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              You have an active {user.subscriptionType} subscription!
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, px: 4, py: 1.5 }}
              onClick={() => history.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </Box>
        ) : (
          <Elements stripe={stripePromise}>
            <SubscriptionForm user={user} setUser={setUser} />
          </Elements>
        )}
        <Box sx={{ py: 6, mt: 8, backgroundColor: '#1a2a44', borderRadius: '15px' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  ZvertexAI
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Empowering careers with AI-driven solutions.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Quick Links
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-zvertexai')}>
                  Why ZvertexAI?
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, cursor: 'pointer' }} onClick={() => history.push('/interview-faqs')}>
                  Interview FAQs
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                  ZGPT Copilot
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  Contact Us
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                  Address: 5900 BALCONES DR #16790 AUSTIN, TX 78731
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                  Phone: 737-239-0920
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => history.push('/contact-us')}
                >
                  Reach Out
                </Button>
              </Grid>
            </Grid>
            <Typography variant="body2" align="center" sx={{ color: 'white', mt: 4 }}>
              © 2025 ZvertexAI. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}

export default Subscription;