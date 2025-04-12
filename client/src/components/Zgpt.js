import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const ZGPT = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await axios.post(
        `${apiUrl}/api/zgpt`,
        { query },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setResponse(res.data.response);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to get response');
      console.error('ZGPT error:', err);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        ZGPT - Ask Anything
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Your Question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Ask ZGPT
        </Button>
      </Box>
      {error && (
        <Typography color="error" style={{ marginTop: '1rem' }}>
          {error}
        </Typography>
      )}
      {response && (
        <Box style={{ marginTop: '1rem' }}>
          <Typography variant="h6">Response:</Typography>
          <Typography>{response}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default ZGPT;