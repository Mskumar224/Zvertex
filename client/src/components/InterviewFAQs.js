import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Container, Grid, Card, CardContent, Divider, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

function InterviewFAQs() {
  const history = useHistory();
  const [search, setSearch] = useState('');
  
  const technologies = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript',
    'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring', 'ASP.NET', 'Express.js',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Oracle', 'AWS', 'Azure', 'Google Cloud',
    'Docker', 'Kubernetes', 'TensorFlow', 'PyTorch', 'Git', 'Jenkins', 'Ansible', 'Terraform'
  ];

  const filteredTechnologies = technologies.filter(tech => 
    tech.toLowerCase().includes(search.toLowerCase())
  );

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
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
            Interview FAQs
          </Typography>
          <Box sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search technologies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'white', mr: 1 }} />,
              }}
              sx={{ 
                input: { color: 'white' }, 
                '& .MuiOutlinedInput-root': { 
                  '& fieldset': { borderColor: 'white' }, 
                  '&:hover fieldset': { borderColor: '#ff6d00' },
                  '&.Mui-focused fieldset': { borderColor: '#ff6d00' }
                } 
              }}
            />
          </Box>
          <Grid container spacing={3}>
            {filteredTechnologies.length > 0 ? (
              filteredTechnologies.map((tech, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      backgroundColor: '#1e1e1e', 
                      color: 'white', 
                      borderRadius: '15px', 
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)', cursor: 'pointer' }
                    }}
                    onClick={() => alert(`Coming soon: FAQs for ${tech}`)}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {tech}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Click to explore interview questions and tips for {tech}.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
                No technologies found matching your search.
              </Typography>
            )}
          </Grid>
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

export default InterviewFAQs;