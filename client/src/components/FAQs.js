import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function FAQs({ user }) {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const technologies = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Swift', 'Kotlin', 'TypeScript',
    'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Ansible',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
    'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind CSS',
    'GraphQL', 'REST API', 'gRPC', 'WebSocket',
    'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI',
    'Apache Kafka', 'RabbitMQ', 'Spark', 'Hadoop',
  ];

  const filteredTech = technologies.filter((tech) =>
    tech.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg" sx={{ pt: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => history.push('/')} sx={{ color: '#ff6d00' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Interview FAQs
          </Typography>
        </Box>
        <TextField
          label="Search Technologies"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 4,
            input: { color: 'white' },
            label: { color: 'white' },
            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
          }}
        />
        <Grid container spacing={3}>
          {filteredTech.map((tech) => (
            <Grid item xs={12} sm={6} md={4} key={tech}>
              <Card
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  borderRadius: '15px',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)', backgroundColor: '#ff6d00' },
                  cursor: 'pointer',
                }}
                onClick={() => alert(`FAQs for ${tech} coming soon!`)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {tech}
                  </Typography>
                  <Typography variant="body2">
                    Explore interview questions and tips (coming soon).
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#1a2a44', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                About ZvertexAI
              </Typography>
              <Typography variant="body2">
                Pioneering AI-driven solutions for job seekers and innovators. Join us to shape the future of work.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact Us
              </Typography>
              <Typography variant="body2">
                Address: 5900 BALCONES DR #16790, AUSTIN, TX 78731
                <br />
                Phone: 737-239-0920
                <br />
                Email: zvertexai@honotech.com
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              <Box>
                <Button color="inherit" onClick={() => history.push('/why-zvertex')}>
                  Why ZvertexAI?
                </Button>
                <br />
                <Button color="inherit" onClick={() => history.push('/faqs')}>
                  Interview FAQs
                </Button>
                <br />
                <Button color="inherit" onClick={() => history.push('/contact')}>
                  Contact
                </Button>
              </Box>
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

export default FAQs;