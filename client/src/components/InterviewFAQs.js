import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Grid, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function InterviewFAQs() {
  const history = useHistory();

  const faqs = [
    {
      question: 'How should I prepare for a technical interview?',
      answer: 'Focus on core concepts like data structures, algorithms, and system design. Practice coding problems on platforms like LeetCode and review your resume projects. Use ZGPT to simulate mock interviews!'
    },
    {
      question: 'What are common behavioral questions?',
      answer: 'Expect questions like "Tell me about a challenge you faced" or "Describe a time you led a team." Use the STAR method (Situation, Task, Action, Result) to structure your answers.'
    },
    {
      question: 'How does ZvertexAI help with interviews?',
      answer: 'ZvertexAI offers AI-driven resume optimization, job matching, and ZGPT for real-time interview coaching. Subscribe to access personalized prep tools!'
    },
    {
      question: 'What’s the best way to follow up after an interview?',
      answer: 'Send a concise thank-you email within 24 hours, referencing specific discussion points. ZGPT can help draft professional follow-ups.'
    }
  ];

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
            Interview FAQs
          </Typography>
          <Box sx={{ width: '100%', maxWidth: '800px' }}>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  mb: 2,
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00e676' }} />}>
                  <Typography variant="h6">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
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

export default InterviewFAQs;