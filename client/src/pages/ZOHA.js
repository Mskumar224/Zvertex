import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

function ZOHA() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/zoha/search`, { query });
      setResults(data.results);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([{ title: 'Error', content: 'Failed to fetch results. Try again later.' }]);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
        ZvertexAI - ZOHA
      </Typography>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <TextField
          variant="outlined"
          placeholder="Ask ZOHA about jobs, skills, or careers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{
            flexGrow: 1,
            mr: 2,
            background: '#fff',
            borderRadius: '25px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              '& fieldset': { borderColor: '#1976d2' },
              '&:hover fieldset': { borderColor: '#115293' },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            borderRadius: '25px',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            color: '#fff',
            '&:hover': { background: 'linear-gradient(45deg, #115293, #1976d2)' },
          }}
        >
          Search
        </Button>
      </Box>
      {results.length > 0 && (
        <Box sx={{ p: 3, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Results</Typography>
          {results.map((result, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#1976d2' }}>{result.title}</Typography>
              <Typography sx={{ color: '#6B7280' }}>{result.content}</Typography>
              {result.link && (
                <Typography variant="body2">
                  <a href={result.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                    {result.link}
                  </a>
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default ZOHA;