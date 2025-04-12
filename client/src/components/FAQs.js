import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, TextField, Grid, Card, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function FAQs({ user }) {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const technologies = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript',
    'Go', 'Rust', 'SQL', 'R', 'MATLAB', 'Scala', 'Perl', 'Haskell', 'Dart', 'Lua'
  ];

  const filteredTechnologies = technologies.filter(tech =>
    tech.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <IconButton onClick={() => history.goBack()} sx={{ color: '#ff6d00', mt: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ mt: 4, mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          Interview FAQs
        </Typography>
        <TextField
          label="Search Technologies"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4, input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } } }}
        />
        <Grid container spacing={3}>
          {filteredTechnologies.map((tech, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderRadius: '15px',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' },
                }}
                onClick={() => alert(`FAQs for ${tech} coming soon!`)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{tech}</Typography>
                  <Typography variant="body2">Click to view common interview questions.</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
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

export default FAQs;