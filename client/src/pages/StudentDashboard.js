import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, useMediaQuery, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
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
        console.error('Fetch user error:', err);
        setError('Failed to fetch user data. Please log in again.');
        setTimeout(() => history.push('/login'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [history]);

  const handleJobApply = () => history.push('/job-apply');

  return (
    <Container maxWidth={isMobile ? 'xs' : 'md'} sx={{ py: isMobile ? 4 : 8 }}>
      <Box sx={{ p: isMobile ? 2 : 4, background: '#fff', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} align="center" sx={{ color: '#1976d2', mb: 4, fontWeight: 600 }}>
          ZvertexAI - Student Dashboard
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : user ? (
          <>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Welcome, {user.name}!</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Email: {user.email}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Phone: {user.phone}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Subscription: {user.subscription}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Technology: {user.selectedTechnology || 'Not set'}</Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>Companies: {user.selectedCompanies?.join(', ') || 'Not set'}</Typography>
            <Button variant="contained" color="primary" fullWidth onClick={handleJobApply} sx={{ py: isMobile ? 1 : 1.5, fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Apply for Jobs
            </Button>
          </>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>Unable to load user data.</Typography>
        )}
      </Box>
    </Container>
  );
}

export default StudentDashboard;