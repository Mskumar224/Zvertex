import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch user data. Please try again.');
        console.error('Fetch user error:', err.message);
      }
    };
    fetchUser();
  }, []);

  const handleJobApply = () => history.push('/job-apply');

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ p: 4, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} align="center" sx={{ color: '#1976d2', mb: 4 }}>
          ZvertexAI - Student Dashboard
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        {user ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Welcome, {user.name}!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Email: {user.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Subscription: {user.subscription}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Preferred Technology: {user.selectedTechnology || 'Not set'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Preferred Companies: {user.selectedCompanies?.join(', ') || 'Not set'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleJobApply}
              sx={{ py: 1.5, borderRadius: '25px' }}
            >
              Apply for Jobs
            </Button>
          </>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Loading user data...
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default StudentDashboard;