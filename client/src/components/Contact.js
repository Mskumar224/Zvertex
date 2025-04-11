import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Divider, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/contact`, { name, email, message });
      setSuccess('Your message has been sent! We’ll get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send message');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ py: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => history.goBack()}
            sx={{ color: '#ff6d00', mb: 2 }}
          >
            Back
          </Button>
          <Box sx={{ maxWidth: '600px', mx: 'auto', mt: 8 }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
            {success && <Typography sx={{ mb: 2, textAlign: 'center', color: '#00e676' }}>{success}</Typography>}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ 
                  mb: 2, 
                  input: { color: 'white' }, 
                  label: { color: 'white' }, 
                  '& .MuiOutlinedInput-root': { 
                    '& fieldset': { borderColor: 'white' }, 
                    '&:hover fieldset': { borderColor: '#ff6d00' },
                    '&.Mui-focused fieldset': { borderColor: '#ff6d00' }
                  } 
                }}
              />
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ 
                  mb: 2, 
                  input: { color: 'white' }, 
                  label: { color: 'white' }, 
                  '& .MuiOutlinedInput-root': { 
                    '& fieldset': { borderColor: 'white' }, 
                    '&:hover fieldset': { borderColor: '#ff6d00' },
                    '&.Mui-focused fieldset': { borderColor: '#ff6d00' }
                  } 
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
                  input: { color: 'white' }, 
                  label: { color: 'white' }, 
                  '& .MuiOutlinedInput-root': { 
                    '& fieldset': { borderColor: 'white' }, 
                    '&:hover fieldset': { borderColor: '#ff6d00' },
                    '&.Mui-focused fieldset': { borderColor: '#ff6d00' }
                  } 
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ 
                  mb: 2, 
                  backgroundColor: '#ff6d00', 
                  '&:hover': { backgroundColor: '#e65100' },
                  py: 1.5
                }}
              >
                Send Message
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                ZvertexAI empowers careers with AI-driven job matching, innovative projects, and ZGPT, your personal copilot. Join us to shape the future of technology.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Quick Links
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-zvertexai')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/interview-faqs')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                Contact Us
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  5900 Balcones Dr #16790, Austin, TX 78731
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  (737) 239-0920
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                  contact@zvertexai.com
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                sx={{ mt: 2, backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }} 
                onClick={() => history.push('/register')}
              >
                Subscribe Now
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" align="center">
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Contact;