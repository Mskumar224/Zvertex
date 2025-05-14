import React, { useState } from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResumeUpload: React.FC = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpload = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to upload a resume.');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('resume', file);
        try {
          await axios.post('https://zvertexai-orzv.onrender.com/api/upload-resume', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
          localStorage.setItem('resumeUploaded', 'true');
          setMessage('Resume uploaded successfully! Redirecting to companies...');
          setTimeout(() => navigate('/companies'), 1000);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Server error';
          if (error.response?.status === 401 || error.response?.status === 403) {
            setMessage('Unauthorized: Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            setTimeout(() => navigate('/login'), 1000);
          } else if (error.response?.status === 404) {
            setMessage('Upload endpoint not found. Please check the server.');
          } else if (error.response?.status === 400) {
            setMessage(`Upload failed: ${errorMessage}`);
          } else {
            setMessage(`Upload failed: ${errorMessage}`);
          }
        }
      }
    };
    input.click();
  };

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Upload Resume</Typography>
      <Box>
        <Button
          variant="contained"
          onClick={handleUpload}
          sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}
        >
          Choose Resume
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Back
        </Button>
      </Box>
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('failed') || message.includes('Unauthorized') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default ResumeUpload;