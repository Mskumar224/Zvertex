import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

function ResumeUpload({ user, apiUrl }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const fileInputRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    if (!user) {
      setError('Please log in to upload a resume');
      setTimeout(() => {
        if (isMounted.current) {
          history.push('/login');
        }
      }, 2000);
    }
    return () => {
      isMounted.current = false;
    };
  }, [user, history]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('No file selected');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axios.post(
        `${apiUrl}/api/resume/upload`,
        formData,
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (isMounted.current) {
        setSuccess('Resume uploaded successfully!');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.response?.data?.msg || 'Failed to upload resume');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      color: 'white',
    }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            Upload Resume
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              p: 4,
              borderRadius: '15px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              transition: 'all 0.3s ease',
            }}
          >
            {error && <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ borderRadius: '10px' }}>{success}</Alert>}
            <Button
              variant="contained"
              component="label"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
            >
              Choose File
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
                Selected: {file.name}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !file}
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ResumeUpload;