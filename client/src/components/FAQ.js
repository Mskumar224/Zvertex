import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Container, Grid, Card, CardContent, Divider, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function FAQ() {
  const history = useHistory();
  const [search, setSearch] = useState('');

  const technologies = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'TypeScript',
    'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Spring', 'Flutter', 'Swift', 'Kotlin',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Git',
    'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'GraphQL'
  ];

  const filteredTechnologies = technologies.filter(tech => 
    tech.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => history.goBack()}
          sx={{ mt: 2, color: '#ff6d00' }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ mt: 4, mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Interview FAQs
        </Typography>
        <TextField
          label="Search Technology"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ 
            mb: 4, 
            input: { color: 'white' }, 
            label: { color: '#b0b0b0' }, 
            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6d00' } } 
          }}
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
                  '&:hover': { transform: 'scale(1.05)' }, 
                  cursor: 'pointer' 
                }}
                onClick={() => alert(`Q&A for ${tech} coming soon!`)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{tech}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Click to explore common interview questions (coming soon).
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', textAlign: 'center', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>ZvertexAI</Typography>
              <Typography variant="body2">
                Empowering careers and businesses with AI-driven solutions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Quick Links</Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/contact')}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/faq')}>
                Interview FAQs
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/why-us')}>
                Why ZvertexAI?
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                ZGPT Copilot
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Contact</Typography>
              <Typography variant="body2">5900 Balcones Dr #16790, Austin, TX 78731</Typography>
              <Typography variant="body2">Phone: 737-239-0920 (151)</Typography>
              <Typography variant="body2">Email: support@zvertexai.com</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, backgroundColor: '#fff' }} />
          <Typography variant="body2">
            © 2025 ZvertexAI. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default FAQ;