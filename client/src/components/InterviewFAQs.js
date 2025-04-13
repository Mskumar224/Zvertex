import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Container, Grid, Card, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

function InterviewFAQs({ user }) {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const technologies = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'TypeScript', 'PHP', 'Swift',
    'Kotlin', 'Rust', 'Scala', 'Perl', 'Haskell', 'R', 'SQL', 'NoSQL', 'React', 'Angular',
    'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring', 'ASP.NET', 'Express.js', 'GraphQL',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Ansible',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Science', 'Blockchain',
    'Solidity', 'Cybersecurity', 'Penetration Testing', 'DevOps', 'CI/CD', 'Big Data', 'Hadoop',
    'Spark', 'Kafka', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
  ];

  const filteredTechs = technologies.filter(tech =>
    tech.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => history.goBack()} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Interview FAQs
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', mb: 4 }}>
          <TextField
            placeholder="Search Technologies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flexGrow: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
            }}
            InputProps={{
              endAdornment: <SearchIcon sx={{ color: 'white' }} />,
            }}
          />
        </Box>
        <Grid container spacing={2}>
          {filteredTechs.map((tech) => (
            <Grid item xs={12} sm={6} md={4} key={tech}>
              <Card
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
                onClick={() => alert(`FAQs for ${tech} coming soon!`)}
              >
                <CardContent>
                  <Typography variant="h6">{tech}</Typography>
                  <Typography variant="body2">Click to view interview questions</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white', mt: 4 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>ZvertexAI</Typography>
                <Typography variant="body2">
                  Empowering careers with AI-driven job matching, projects, and ZGPT copilot.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/why-zvertexai')}>
                  Why ZvertexAI?
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/interview-faqs')}>
                  Interview FAQs
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer' }} onClick={() => history.push('/zgpt')}>
                  ZGPT Copilot
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>Contact Us</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Address: 5900 BALCONES DR #16790 AUSTIN, TX 78731
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Phone: 737-239-0920
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => history.push('/contact-us')}
                >
                  Reach Out
                </Button>
              </Grid>
            </Grid>
            <Typography variant="body2" align="center" sx={{ mt: 4 }}>
              © 2022 ZvertexAI. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}

export default InterviewFAQs;