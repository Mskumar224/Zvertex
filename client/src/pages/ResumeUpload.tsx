import React, { useState } from 'react';
import { Container, Typography, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [technology, setTechnology] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }
    if (!technology) {
      setMessage('Please specify your technology');
      return;
    }
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('token', localStorage.getItem('token') || '');
    formData.append('technology', technology);
    try {
      const res = await axios.post('https://zvertexai-orzv.onrender.com/api/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuggestions(res.data.suggestions);
      localStorage.setItem('resumeUploaded', 'true');
      setMessage('Resume uploaded successfully! Redirecting to companies...');
      setTimeout(() => navigate('/companies'), 1000);
    } catch (error: any) {
      setMessage('Upload failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Upload Resume</Typography>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} style={{ marginBottom: '20px' }} />
        <TextField
          label="Which technology do you specialize in? (e.g., JavaScript, Python)"
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2, mr: 2, px: 4, py: 1.5 }}>Upload</Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Back
        </Button>
      </form>
      {suggestions.length > 0 && (
        <div>
          <Typography variant="h6" sx={{ mt: 2 }}>Suggestions:</Typography>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('failed') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default ResumeUpload;