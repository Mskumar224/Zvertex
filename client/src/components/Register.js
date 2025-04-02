import React, { useState } from 'react';
import { TextField, Button, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js'; // For Stripe.js

const stripePromise = loadStripe('pk_live_51R0u7fRr16KPJ9OnPwlpNKyHkwGHnvtZqibd2PWsxgkgqyzYOmx4AZE69YTmsrqpI5fk5aCSj04972mddYaBR8da004FxbliCE'); // Replace with your live publishable key

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('STUDENT');
  const history = useHistory();

  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';
  console.log('API URL being used:', apiUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register the user
      await axios.post(`${apiUrl}/api/auth/register`, { email, password, subscriptionType });
      
      // Create Stripe Checkout session
      const response = await axios.post(`${apiUrl}/api/payment/create-checkout-session`, {
        email,
        subscriptionType,
      });

      if (subscriptionType === 'BUSINESS') {
        window.location.href = response.data.url; // Redirect to email for Business plan
      } else {
        window.location.href = response.data.url; // Redirect to Stripe Checkout
      }
    } catch (err) {
      console.error('Register Error:', err.response ? err.response.data : err.message);
      alert(err.response?.data.msg || 'Registration failed. Check console for details.');
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