import React, { useState } from 'react';
import { Container, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscription, setSubscription] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate();

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setPhoneError('Phone number is required');
      return;
    }
    if (!validatePhone(phone)) {
      setPhoneError('Invalid phone number format (e.g., +1234567890)');
      return;
    }
    setPhoneError('');
    try {
      const res = await axios.post('https://zvertexai-orzv.onrender.com/api/signup', {
        email,
        password,
        subscription,
        phone,
      }, {
        headers: { Authorization: null },
      });
      setMessage(res.data.message);
      setShowOtpField(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Server error';
      const errors = error.response?.data?.errors || [];
      if (error.response?.status === 400 && errors.length > 0) {
        const validationError = errors.map((err: any) => err.msg).join(', ');
        setMessage(`Signup failed: ${validationError}`);
      } else if (error.response?.status === 401) {
        setMessage('Unauthorized: Please ensure no authentication token is sent during signup.');
      } else if (error.response?.status === 404) {
        setMessage('Signup endpoint not found. Please check the server.');
      } else {
        setMessage(`Signup failed: ${errorMessage}`);
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://zvertexai-orzv.onrender.com/api/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setMessage('Signup successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Server error';
      if (error.response?.status === 404) {
        setMessage('OTP verification endpoint not found. Please check the server.');
      } else {
        setMessage(`OTP verification failed: ${errorMessage}`);
      }
    }
  };

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Signup</Typography>
      {!showOtpField ? (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Subscription</InputLabel>
            <Select
              value={subscription}
              onChange={(e) => setSubscription(e.target.value)}
              label="Subscription"
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Vendor/Recruiter">Vendor/Recruiter</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!phoneError}
            helperText={phoneError}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}>Signup</Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ mt: 2, px: 4, py: 1.5 }}
          >
            Back
          </Button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <TextField
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}>Verify OTP</Button>
          <Button
            variant="outlined"
            onClick={() => setShowOtpField(false)}
            sx={{ mt: 2, px: 4, py: 1.5 }}
          >
            Back
          </Button>
        </form>
      )}
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('failed') || message.includes('Unauthorized') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Signup;