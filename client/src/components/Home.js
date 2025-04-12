import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, TextField, Button, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';

function Home({ user }) {
  const [query, setQuery] = useState('');
  const [zgptResponse, setZgptResponse] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleZgptSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.post(`${apiUrl}/api/zgpt/query`, { query });
      setZgptResponse(res.data.text);
      setError('');
    } catch (err) {
      setError('Failed to fetch ZGPT response');
      setZgptResponse('');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome to ZvertexAI
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Empowering your career with AI-driven job applications and innovative projects.
          </Typography>
          <Box component="form" onSubmit={handleZgptSearch} sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Ask ZGPT about jobs or tech..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                mb: 2,
                input: { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: '#ff6d00' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' }, borderRadius: '25px', px: 4, py: 1.5 }}
            >
              Search with ZGPT
            </Button>
          </Box>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {zgptResponse && (
            <Card sx={{ maxWidth: '600px', mx: 'auto', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <CardContent>
                <Typography variant="body1">{zgptResponse}</Typography>
              </CardContent>
            </Card>
          )}
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Job Automation
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Upload your resume, set preferences, and let our AI apply to jobs for you in real-time.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={() => history.push(user ? '/dashboard' : '/register')}
                >
                  {user ? 'Go to Dashboard' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Join Our Projects
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Work on cutting-edge AI, cloud, and big data projects to boost your skills.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
                  onClick={() => history.push('/projects')}
                >
                  Explore Projects
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ py: 3, backgroundColor: '#1a2a44', textAlign: 'center', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
              <Typography variant="body2">
                Address: 5900 Balcones Dr #16790, Austin, TX 78731
              </Typography>
              <Typography variant="body2">
                Phone: (737) 239-0920
              </Typography>
              <Typography variant="body2">
                Email: support@zvertexai.com
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/projects')}>
                Join Our Projects
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Follow Us</Typography>
              <Typography variant="body2">Twitter | LinkedIn | GitHub</Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 2 }}>
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;