import React, { useState } from 'react';
import { TextField, Button, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('STUDENT');
  const history = useHistory();

  const apiUrl = 'https://zvertexai-orzv.onrender.com'; // Hardcoded for consistency
  const TEST_EMAIL = 'test@zvertexai.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting registration process:', { email, subscriptionType });
    try {
      // Register the user
      console.log('Sending registration request to:', `${apiUrl}/api/auth/register`);
      const registerResponse = await axios.post(`${apiUrl}/api/auth/register`, { email, password, subscriptionType });
      console.log('User registered successfully:', registerResponse.data);

      // Handle test email case
      if (email === TEST_EMAIL) {
        localStorage.setItem('token', registerResponse.data.token);
        history.push('/dashboard');
        return;
      }

      // Only initialize Stripe for non-test users
      const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) {
        throw new Error('Stripe publishable key is not configured. Contact support.');
      }

      const stripe = await loadStripe(stripeKey);
      if (!stripe) {
        throw new Error('Failed to initialize Stripe. Please try again.');
      }

      // Create Stripe Checkout session for non-test users
      console.log('Creating Stripe Checkout session at:', `${apiUrl}/api/payment/create-checkout-session`);
      const response = await axios.post(`${apiUrl}/api/payment/create-checkout-session`, {
        email,
        subscriptionType,
      });

      console.log('Stripe session response:', response.data);
      window.location.href = response.data.url; // Redirect to Stripe Checkout or mailto
    } catch (err) {
      console.error('Register Error:', err.message, err.response?.data);
      const errorMsg = err.response?.data?.error || err.response?.data?.msg || 'Registration failed';
      const errorDetails = err.response?.data?.details || err.message;
      alert(`Error: ${errorMsg}${errorDetails ? ` - ${errorDetails}` : ''}`);
    }
  };

  const goHome = () => history.push('/');

  return (
    <div>
      <div className="header">
        <h1 onClick={goHome}>ZvertexAI</h1>
        <div className="nav-links">
          <a href="/">Login</a>
        </div>
      </div>
      <div className="hero">
        <Typography variant="h2">Join Us</Typography>
        <Typography variant="body1">Create an account to get started</Typography>
      </div>
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <button className="back-button" onClick={() => history.goBack()}>
          Back
        </button>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            select
            label="Subscription Type"
            fullWidth
            margin="normal"
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
          >
            <MenuItem value="STUDENT">Student ($59.99/Month)</MenuItem>
            <MenuItem value="VENDOR">Vendor ($99.99/Month)</MenuItem>
            <MenuItem value="BUSINESS">Business (Contact Us)</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register & Pay
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;