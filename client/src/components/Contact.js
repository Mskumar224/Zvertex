import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';

function Contact({ user }) {
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', message: '' });
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
      await axios.post(`${apiUrl}/api/contact`, formData);
      alert('Message sent successfully');
      setFormData({ ...formData, message: '' });
    } catch (err) {
      alert(err.response?.data?.msg || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Contact Us
          </Typography>
          <Box>
            {user ? (
              <Button
                variant="outlined"
                sx={{ borderColor: '#00e676', color: '#00e676', '&:hover': { backgroundColor: 'rgba(0,230,118,0.1)' } }}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: '#00e676', '&:hover': { backgroundColor: '#00c853' } }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Get in Touch
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
                      mb: 2,
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
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: 'white' },
                      '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                    }}
                  />
                  <TextField
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    sx={{
                      mb: 2,
                      input: { color: 'white' },
                      label: { color: 'white' },
                      '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Contact Information
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  Email: zvertexai@honotech.com
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  Phone: +1 (555) 123-4567
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  Address: 123 Tech Lane, Silicon Valley, CA 94043
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Our team is available 24/7 to assist with your queries. Reach out for support, partnerships, or feedback.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
          © 2025 ZvertexAI. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Contact;