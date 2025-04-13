import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function InterviewFAQs({ user }) {
  const navigate = useNavigate();

  const faqs = [
    {
      question: 'How should I prepare for a technical interview?',
      answer: 'Review core concepts, practice coding problems on platforms like LeetCode, and prepare to explain your thought process clearly.',
    },
    {
      question: 'What are common behavioral questions?',
      answer: 'Expect questions like "Tell me about a time you faced a challenge" or "How do you handle conflict?" Use the STAR method to structure your answers.',
    },
    {
      question: 'How can ZGPT help with interview prep?',
      answer: 'ZGPT offers mock interviews, resume feedback, and personalized tips. Upgrade to Pro or Enterprise to access it!',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Interview FAQs
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

        <Box sx={{ my: 4 }}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', mb: 2, borderRadius: '10px' }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                <Typography variant="h6">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Button
          variant="contained"
          sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
          onClick={() => navigate('/contact')}
        >
          Ask Us More
        </Button>

        <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
          © 2025 ZvertexAI. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default InterviewFAQs;