import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ScraperPreferences: React.FC = () => {
  const [jobBoards, setJobBoards] = useState<string[]>(['Indeed']);
  const [frequency, setFrequency] = useState('daily');
  const [location, setLocation] = useState('United States');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');
        const res = await axios.post('https://zvertexai-orzv.onrender.com/api/update-scraper-preferences', { token });
        setJobBoards(res.data.preferences.jobBoards || ['Indeed']);
        setFrequency(res.data.preferences.frequency || 'daily');
        setLocation(res.data.preferences.location || 'United States');
      } catch (error) {
        console.error('Fetch preferences error:', error);
      }
    };
    fetchPreferences();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const res = await axios.post('https://zvertexai-orzv.onrender.com/api/update-scraper-preferences', {
        token,
        jobBoards,
        frequency,
        location,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      setMessage('Error: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Scraper Preferences</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Job Boards</InputLabel>
          <Select
            multiple
            value={jobBoards}
            onChange={(e) => setJobBoards(e.target.value as string[])}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            <MenuItem value="Indeed">Indeed</MenuItem>
            <MenuItem value="LinkedIn">LinkedIn</MenuItem>
            <MenuItem value="Glassdoor">Glassdoor</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Frequency</InputLabel>
          <Select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            label="Frequency"
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}>Save</Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Back
        </Button>
      </form>
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('Error') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default ScraperPreferences;