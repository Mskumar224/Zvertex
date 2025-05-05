import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

function SubscriptionForm() {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const plan = query.get('plan') || 'STUDENT';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/submit`,
        { name, email, phone, plan }
      );
      alert('Thank you! The ZvertexAI team will contact you soon to finalize your subscription.');
      history.push('/');
    } catch (err) {
      console.error('Subscription form error:', err.response?.data?.error || err.message);
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }} className="zgpt-container">
      <div className="card">
        <Typography variant="h4" gutterBottom align="center">
          Subscribe to {plan} Plan
        </Typography>
        <Typography align="center" sx={{ mb: 3 }}>
          Submit your details, and our team will reach out to finalize your subscription.
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 3 }}
            variant="outlined"
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
            variant="outlined"
          />
          <TextField
            label="Phone Number"
            type="tel"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mb: 3 }}
            variant="outlined"
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            className="back-button"
            sx={{ py: 1.5 }}
          >
            Submit Details
          </Button>
        </Box>
      </div>
    </Container>
  );
}

export default SubscriptionForm;