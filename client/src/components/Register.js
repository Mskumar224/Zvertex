import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!subscriptionType) {
      setError('Please select a subscription type');
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/register`,
        {
          email,
          password,
          subscriptionType,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      localStorage.setItem('token', response.data.token);
      history.push('/dashboard');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', py: 4 }}>
      <Container maxWidth="sm">
        <IconButton
          onClick={() => history.push('/')}
          sx={{ color: 'white', mb: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Paper
          sx={{
            p: 4,
            backgroundColor: '#1e1e1e',
            borderRadius: '15px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Register
          </Typography>
          {error && (
            <Typography sx={{ color: '#ff1744', mb: 2 }}>{error}</Typography>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3, backgroundColor: '#263238' }}
              InputLabelProps={{ style: { color: '#b0bec5' } }}
              InputProps={{ style: { color: 'white' } }}
              required
            />
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3, backgroundColor: '#263238' }}
              InputLabelProps={{ style: { color: '#b0bec5' } }}
              InputProps={{ style: { color: 'white' } }}
              required
            />
            <FormControl fullWidth sx={{ mb: 3, backgroundColor: '#263238', borderRadius: '4px' }}>
              <InputLabel sx={{ color: '#b0bec5', '&.Mui-focused': { color: '#b0bec5' } }}>
                Subscription Type
              </InputLabel>
              <Select
                value={subscriptionType}
                onChange={(e) => setSubscriptionType(e.target.value)}
                sx={{
                  color: 'white',
                  '.MuiSvgIcon-root': { color: 'white' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#b0bec5' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6d00' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6d00' },
                }}
                required
              >
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Recruiter">Recruiter</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '10px',
                py: 1.5,
              }}
            >
              Register
            </Button>
          </Box>
          <Typography sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Button
              sx={{ color: '#00e676', textTransform: 'none' }}
              onClick={() => history.push('/login')}
            >
              Login
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;