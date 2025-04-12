import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Grid } from '@mui/material';
import axios from 'axios';

function ContactUs({ user }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/contact`, { name, email, message });
      setSuccess('Your message has been sent!');
      setError('');
      setName('');
      setMessage('');
      if (!user) setEmail('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send message');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            variant="text"
            sx={{ mb: 2, color: '#00e676', alignSelf: 'flex-start' }}
            onClick={() => history.push('/')}
          >
            Back to Home
          </Button>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#ff6d00' }}>
            Contact Us
          </Typography>
          {success && <Typography color="success.main" sx={{ mb: 2 }}>{success}</Typography>}
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit} sx={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            p: 4,
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ff6d00' },
                  '&:hover fieldset': { borderColor: '#e65100' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
                '& .MuiInputLabel-root': { color: 'white' },
                input: { color: 'white' },
              }}
            />
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!user}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ff6d00' },
                  '&:hover fieldset': { borderColor: '#e65100' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
                '& .MuiInputLabel-root': { color: 'white' },
                input: { color: 'white' },
              }}
            />
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ff6d00' },
                  '&:hover fieldset': { borderColor: '#e65100' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
                '& .MuiInputLabel-root': { color: 'white' },
                textarea: { color: 'white' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
                fontWeight: 'bold',
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Container>
      <Box sx={{
        py: 4,
        backgroundColor: '#1a2a44',
        color: 'white',
        textAlign: 'center',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                Empowering careers with AI-driven job matching, innovative projects, and ZGPT copilot.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" onClick={() => history.push('/faq')}>Interview FAQs</Button>
                <Button color="inherit" onClick={() => history.push('/why-us')}>Why ZvertexAI?</Button>
                <Button color="inherit" onClick={() => history.push('/projects')}>Our Projects</Button>
                <Button color="inherit" onClick={() => history.push('/contact-us')}>Contact Us</Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Contact Info
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2">
                Email: support@zvertexai.com
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4 }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default ContactUs;