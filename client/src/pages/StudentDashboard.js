import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function StudentDashboard() {
  const [userData, setUserData] = useState(null);
  const [recruiters, setRecruiters] = useState([{}, {}, {}]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
        setRecruiters(response.data.recruiters?.slice(0, 3).map(r => ({ id: r._id })) || [{}, {}, {}]);
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
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUploadSuccess = (data) => {
    setUserData(prev => ({
      ...prev,
      profiles: [...(prev?.profiles || []), { _id: data.profileId, extractedTech: data.detectedTech, extractedRole: data.detectedRole }],
    }));
    setRecruiters(prev => {
      const newRecruiters = [...prev];
      const emptyIndex = newRecruiters.findIndex(r => !r.id);
      if (emptyIndex !== -1) newRecruiters[emptyIndex] = { id: data.profileId };
      return newRecruiters;
    });
  };

  const handleExport = () => {
    if (userData?._id) {
      window.location.href = `${process.env.REACT_APP_API_URL}/api/job/export-dashboard/${userData._id}`;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
          ZvertexAI - Student Dashboard
        </Typography>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
          ZvertexAI - Student Dashboard
        </Typography>
        <Typography>Please log in to view your dashboard.</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, borderRadius: '25px' }} onClick={() => window.location.href = '/login'}>
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
        ZvertexAI - Student Dashboard
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}. Please try logging in again or contact support.
        </Typography>
      )}
      <Typography variant="h6">Welcome, {userData.name || userData.email}</Typography>
      <Typography>Email: {userData.email}</Typography>
      <Typography>Subscription: {userData.subscription || 'None'}</Typography>
      <Typography>Selected Technology: {userData.selectedTechnology || 'Not set'}</Typography>
      <Typography>Preferred Companies: {userData.selectedCompanies?.join(', ') || 'Not set'}</Typography>
      <Typography>Jobs Applied: {userData.jobsApplied?.length || 0}</Typography>
      <Typography>Resumes Uploaded: {userData.resumes || 0}</Typography>
      <Box sx={{ mt: 2, mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2, borderRadius: '25px' }}
          onClick={() => window.location.href = '/job-apply'}
        >
          Manage Job Applications
        </Button>
        <Button variant="contained" color="secondary" sx={{ borderRadius: '25px' }} onClick={handleExport}>
          Export Dashboard
        </Button>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Manage Recruiters (3 Slots)</Typography>
        <Grid container spacing={4}>
          {recruiters.map((recruiter, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ p: 2, border: '1px solid #1976d2', borderRadius: 2, background: '#fff' }}>
                <Typography variant="h6">Recruiter {index + 1} {recruiter.id ? '(Active)' : ''}</Typography>
                {!recruiter.id && <DocumentUpload userId={userData._id} onUploadSuccess={handleUploadSuccess} />}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default StudentDashboard;