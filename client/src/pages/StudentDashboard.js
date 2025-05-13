import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, useMediaQuery } from '@mui/material';
import axios from 'axios';

function StudentDashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Sending GET to /api/auth/user');
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
        setError('');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch user data';
        setError(errorMessage);
        console.error('Fetch user error:', errorMessage, {
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
          headers: err.config?.headers,
          method: err.config?.method,
          responseText: err.response?.data
        });
      }
    };
    fetchUserData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ p: 4, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} align="center" sx={{ color: '#1976d2', mb: 4 }}>
          ZvertexAI - Student Dashboard
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}. Please try logging in again or contact support.
          </Typography>
        )}
        {userData ? (
          <Box>
            <Typography variant="h6">Welcome, {userData.name}</Typography>
            <Typography>Email: {userData.email}</Typography>
            <Typography>Subscription: {userData.subscription || 'None'}</Typography>
            <Typography>Selected Technology: {userData.selectedTechnology || 'Not set'}</Typography>
            <Typography>Preferred Companies: {userData.selectedCompanies?.join(', ') || 'Not set'}</Typography>
            <Typography>Jobs Applied: {userData.jobsApplied?.length || 0}</Typography>
            <Typography>Resumes Uploaded: {userData.resumes || 0}</Typography>
          </Box>
        ) : (
          <Typography>Loading user data...</Typography>
        )}
      </Box>
    </Container>
  );
}

export default StudentDashboard;