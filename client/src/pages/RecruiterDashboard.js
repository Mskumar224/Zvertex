import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Link } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function RecruiterDashboard() {
  const [userData, setUserData] = useState(null);
  const [profiles, setProfiles] = useState([{}, {}, {}, {}, {}]);
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
        setProfiles(response.data.profiles?.slice(0, 5).map(p => ({ id: p._id, extractedTech: p.extractedTech, extractedRole: p.extractedRole })) || [{}, {}, {}, {}, {}]);
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
    setProfiles(prev => {
      const newProfiles = [...prev];
      const emptyIndex = newProfiles.findIndex(p => !p.id);
      if (emptyIndex !== -1) newProfiles[emptyIndex] = { id: data.profileId, extractedTech: data.detectedTech, extractedRole: data.detectedRole };
      return newProfiles;
    });
  };

  const handleExport = () => {
    if (userData?._id) {
      window.location.href = `${process.env.REACT_APP_API_URL}/api/job/export-dashboard/${userData._id}`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          ml: { xs: 0, md: '260px' },
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" sx={{ color: '#1976d2', mb: 4, fontWeight: 600 }}>
          ZvertexAI - Recruiter Dashboard
        </Typography>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          ml: { xs: 0, md: '260px' },
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" sx={{ color: '#1976d2', mb: 4, fontWeight: 600 }}>
          ZvertexAI - Recruiter Dashboard
        </Typography>
        <Typography>Please log in to view your dashboard.</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, borderRadius: '12px', py: 1.2 }}
          onClick={() => window.location.href = '/login'}
        >
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        ml: { xs: 0, md: '260px' },
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#1976d2',
          mb: 4,
          fontWeight: 600,
          cursor: 'pointer',
          '&:hover': { color: '#1565c0' },
        }}
        onClick={() => window.location.href = '/'}
      >
        ZvertexAI - Recruiter Dashboard
      </Typography>
      {error && (
        <Typography sx={{ color: 'error.main', mb: 3, textAlign: 'center', fontSize: '0.9rem' }}>
          {error}. Please try logging in again or contact support.
        </Typography>
      )}
      <Box
        sx={{
          background: '#fff',
          borderRadius: '16px',
          p: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          Welcome, {userData.name || userData.email}
        </Typography>
        <Typography sx={{ mb: 1, fontSize: '0.95rem' }}>
          <strong>Email:</strong> {userData.email}
        </Typography>
        <Typography sx={{ mb: 1, fontSize: '0.95rem' }}>
          <strong>Phone:</strong> {userData.phone || 'Not set'}
        </Typography>
        <Typography sx={{ mb: 1, fontSize: '0.95rem' }}>
          <strong>Subscription:</strong> {userData.subscription || 'None'}
        </Typography>
        <Typography sx={{ mb: 1, fontSize: '0.95rem' }}>
          <strong>Posted Jobs:</strong> {userData.jobsApplied?.length || 0}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: '12px', py: 1.2, px: 3 }}
          onClick={() => window.location.href = '/job-apply'}
        >
          Manage Job Applications
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: '12px', py: 1.2, px: 3 }}
          onClick={() => window.location.href = '/profile-form'}
        >
          Update Profile
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: '12px', py: 1.2, px: 3 }}
          onClick={handleExport}
        >
          Export Dashboard
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ borderRadius: '12px', py: 1.2, px: 3 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
          Manage Profiles (5 Slots)
        </Typography>
        <Grid container spacing={3}>
          {profiles.map((profile, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Profile {index + 1} {profile.id ? '(Active)' : ''}
                </Typography>
                {profile.id && (
                  <>
                    <Typography sx={{ mb: 1, fontSize: '0.9rem' }}>
                      <strong>Technology:</strong> {profile.extractedTech}
                    </Typography>
                    <Typography sx={{ mb: 1, fontSize: '0.9rem' }}>
                      <strong>Role:</strong> {profile.extractedRole}
                    </Typography>
                  </>
                )}
                {!profile.id && <DocumentUpload userId={userData._id} onUploadSuccess={handleUploadSuccess} />}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default RecruiterDashboard;