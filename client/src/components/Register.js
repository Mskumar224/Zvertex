import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';

function Register({ setUser }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/api/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      const userRes = await axios.get(`${apiUrl}/api/auth/user`, {
        headers: { 'x-auth-token': res.data.token },
      });
      setUser(userRes.data);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error registering');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="sm">
        <Box sx={{ py: 5 }}>
          <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                Register
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    mb: 3,
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    mb: 3,
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{
                    mb: 3,
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, mb: 2 }}
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderColor: '#00e676', color: '#00e676', '&:hover': { backgroundColor: 'rgba(0,230,118,0.1)' } }}
                  onClick={() => navigate('/login')}
                >
                  Already have an account? Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default Register;