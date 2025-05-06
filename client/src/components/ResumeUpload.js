import React, { useState } from 'react';
import { Box, Button, Typography, Input } from '@mui/material';
import axios from 'axios';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a resume file.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/upload-resume`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Resume uploaded successfully!');
      setError('');
      setFile(null);
    } catch (error) {
      console.error('Resume upload error:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Failed to upload resume. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload Resume
      </Typography>
      <Input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        sx={{ mb: 2 }}
      />
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success" sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file}
      >
        Upload
      </Button>
    </Box>
  );
}

export default ResumeUpload;