import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, TextField, Chip } from '@mui/material';
import axios from 'axios';

function ResumeUpload({ user, setUser }) {
  const [resume, setResume] = useState(null);
  const [phone, setPhone] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [currentTech, setCurrentTech] = useState('');
  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  if (!user) {
    history.push('/login');
    return null;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setError('');
    } else {
      setError('Please upload a PDF file.');
      setResume(null);
    }
  };

  const addTechnology = () => {
    if (currentTech.trim() && !technologies.includes(currentTech.trim())) {
      setTechnologies([...technologies, currentTech.trim()]);
      setCurrentTech('');
    }
  };

  const removeTechnology = (tech) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const addCompany = () => {
    if (currentCompany.trim() && !companies.includes(currentCompany.trim())) {
      setCompanies([...companies, currentCompany.trim()]);
      setCurrentCompany('');
    }
  };

  const removeCompany = (company) => {
    setCompanies(companies.filter((c) => c !== company));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !phone.trim() || technologies.length === 0 || companies.length === 0) {
      setError('Please upload a resume, enter a phone number, and add at least one technology and company.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('phone', phone);
    formData.append('technologies', JSON.stringify(technologies));
    formData.append('companies', JSON.stringify(companies));

    try {
      const res = await axios.post(`${apiUrl}/api/jobs/resume-upload`, formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Resume uploaded successfully! Auto-applying to jobs...');
      setError('');
      setUser({ ...user, resume: res.data.resume, phone });
      setResume(null);
      setPhone('');
      setTechnologies([]);
      setCompanies([]);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to upload resume');
      setMessage('');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            variant="text"
            sx={{ mb: 2, color: '#00e676', alignSelf: 'flex-start' }}
            onClick={() => history.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#ff6d00' }}>
            Upload Your Resume
          </Typography>
          {message && <Typography color="success.main" sx={{ mb: 2 }}>{message}</Typography>}
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Box component="form" onSubmit={handleSubmit} sx={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            p: 4,
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                mb: 2,
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
              }}
            >
              {resume ? resume.name : 'Choose Resume (PDF)'}
              <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
            </Button>
            <TextField
              label="Phone Number"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ff6d00' },
                  '&:hover fieldset': { borderColor: '#e65100' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
                '& .MuiInputLabel-root': { color: 'white' },
                input: { color: 'white' },
              }}
            />
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Add Technology"
                fullWidth
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ff6d00' },
                    '&:hover fieldset': { borderColor: '#e65100' },
                    '&.Mui-focused fieldset': { borderColor: '#00e676' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  input: { color: 'white' },
                }}
              />
              <Button
                variant="outlined"
                sx={{ color: '#00e676', borderColor: '#00e676' }}
                onClick={addTechnology}
              >
                Add
              </Button>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {technologies.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    onDelete={() => removeTechnology(tech)}
                    sx={{ backgroundColor: '#00e676', color: 'white' }}
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Add Company"
                fullWidth
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCompany()}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#ff6d00' },
                    '&:hover fieldset': { borderColor: '#e65100' },
                    '&.Mui-focused fieldset': { borderColor: '#00e676' },
                  },
                  '& .MuiInputLabel-root': { color: 'white' },
                  input: { color: 'white' },
                }}
              />
              <Button
                variant="outlined"
                sx={{ color: '#00e676', borderColor: '#00e676' }}
                onClick={addCompany}
              >
                Add
              </Button>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {companies.map((company, index) => (
                  <Chip
                    key={index}
                    label={company}
                    onDelete={() => removeCompany(company)}
                    sx={{ backgroundColor: '#00e676', color: 'white' }}
                  />
                ))}
              </Box>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
                fontWeight: 'bold',
              }}
            >
              Upload and Apply
            </Button>
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

export default ResumeUpload;