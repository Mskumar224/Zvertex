import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConfirmAutoApply: React.FC = () => {
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.post('https://zvertexai-orzv.onrender.com/api/update-profile', {
          token,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLinkedinProfile(res.data.user.linkedinProfile || '');
        setCoverLetter(res.data.user.coverLetter || '');
      } catch (error: any) {
        console.error('Error fetching profile:', error.message, error.response?.status);
        if (error.response?.status === 404) {
          setMessage('Profile endpoint not found. Please check the server.');
        } else if (error.response?.status === 401 || error.response?.status === 403) {
          setMessage('Unauthorized: Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        } else {
          setMessage('Failed to load profile data. Please try again later.');
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post('https://zvertexai-orzv.onrender.com/api/auto-apply', {
        token,
        linkedinProfile,
        coverLetter,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Server error';
      if (error.response?.status === 404) {
        setMessage('Auto-apply endpoint not found. Please check the server.');
      } else if (error.response?.status === 400) {
        setMessage(`Error: ${errorMessage}`);
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        setMessage('Unauthorized: Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else {
        setMessage(`Error: ${errorMessage}`);
      }
    }
  };

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Confirm Auto-Apply</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="LinkedIn Profile URL"
          value={linkedinProfile}
          onChange={(e) => setLinkedinProfile(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cover Letter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}>Start Auto-Apply</Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Back
        </Button>
      </form>
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('Error') || message.includes('Unauthorized') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default ConfirmAutoApply;