import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function FAQ({ user }) {
  const history = useHistory();
  const faqs = [
    {
      question: 'What technologies does ZvertexAI support for job matching?',
      answer:
        'We support over 60 technologies, including JavaScript, Python, Java, React, Node.js, Django, AWS, Docker, and more. Upload your resume to auto-detect your skills, or select them manually in your dashboard.',
    },
    {
      question: 'How does the auto-apply feature work?',
      answer:
        'Once you upload your resume and select technologies and companies, our AI applies to matching jobs every 30 minutes. You’ll receive email and SMS confirmations with job IDs and links.',
    },
    {
      question: 'What is the 7-day free trial?',
      answer:
        'All plans (Student, Recruiter, Business) include a 7-day free trial with full access to auto-apply, ZGPT, and dashboards. No payment is required during the trial.',
    },
    {
      question: 'Can I export my applied jobs?',
      answer:
        'Yes, all dashboards allow you to export applied jobs to Excel, including job IDs, titles, companies, technologies, and dates.',
    },
    {
      question: 'How does resume parsing work?',
      answer:
        'Our AI parses PDF, DOC, or DOCX resumes to extract technologies and skills, which are used for precise job matching and auto-applications.',
    },
  ];

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
          Frequently Asked Questions
        </Typography>
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                backgroundColor: '#1e1e1e',
                color: 'white',
                mb: 2,
                borderRadius: '10px',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#ff6d00' }} />}>
                <Typography variant="h6">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
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

export default FAQ;