import React from 'react';
import { Box, Typography, Container, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function InterviewFAQs() {
  const faqs = [
    {
      question: 'How should I prepare for a technical interview?',
      answer: 'Practice coding problems, review system design concepts, and prepare behavioral questions.',
    },
    {
      question: 'What is the STAR method?',
      answer: 'Situation, Task, Action, Result—a structured way to answer behavioral questions.',
    },
    {
      question: 'How can ZGPT help with interviews?',
      answer: 'ZGPT provides mock interview questions, feedback, and real-time guidance.',
    },
  ];

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      color: 'white',
    }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Interview FAQs
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#00e676' }} />}>
                <Typography variant="h6" sx={{ color: '#ffffff' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'white', opacity: 0.9 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default InterviewFAQs;