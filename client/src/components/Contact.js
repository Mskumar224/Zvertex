import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function Contact({ user }) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`${apiUrl}/api/auth/contact`, { name, email, message });
      setSuccess('Message sent successfully! We’ll get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send message.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', py: 4 }}>
      <Container maxWidth="lg">
        <IconButton
          onClick={() => history.push(user ? '/dashboard' : '/')}
          sx={{ color: 'white', mb: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          Contact Us
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                backgroundColor: '#1e1e1e',
                borderRadius: '15px',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Send Us a Message
              </Typography>
              {success && (
                <Typography sx={{ color: '#00e676', mb: 2 }}>{success}</Typography>
              )}
              {error && (
                <Typography sx={{ color: '#ff1744', mb: 2 }}>{error}</Typography>
              )}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  label="Message"
                  fullWidth
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                />
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
                  Send Message
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Address:</strong> 5900 Balcones Dr #16790, Austin, TX 78731
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Phone:</strong> (737) 239-0920
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> support@zvertexai.com
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              We’re here to help! Reach out with any questions about our services, subscriptions, or projects.
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                ZvertexAI empowers careers with AI-driven job matching, innovative projects, and ZGPT, your
                personal copilot. Join us to unlock your potential.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Links
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/faq')}
              >
                Interview FAQs
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/why-us')}
              >
                Why ZvertexAI?
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/zgpt')}
              >
                ZGPT Copilot
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => history.push('/contact')}
              >
                Contact Us
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Contact;