import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

function DocumentUpload({ userId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/upload-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      onUploadSuccess(response.data);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload document';
      setError(errorMessage);
      console.error('Document upload error:', errorMessage, {
        status: err.response?.status,
        data: err.response?.data
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        type="file"
        onChange={handleFileChange}
        fullWidth
        margin="normal"
        inputProps={{ accept: '.pdf,.doc,.docx' }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2, borderRadius: '25px' }}
      >
        Upload Document
      </Button>
    </Box>
  );
}

export default DocumentUpload;