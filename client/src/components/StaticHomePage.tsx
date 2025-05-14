import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StaticHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const companies = JSON.parse(localStorage.getItem('selectedCompanies') || '[]');
        const res = await axios.post('https://zvertexai-orzv.onrender.com/api/select-companies', {
          token,
          companies,
        });

        const userRes = await axios.get('https://zvertexai-orzv.onrender.com/api/health');
        if (companies.length > 0 && localStorage.getItem('resumeUploaded') === 'true') {
          const appliedToday = await axios.post('https://zvertexai-orzv.onrender.com/api/auto-apply', { token });
          setUserData({
            email: decoded.email,
            companies: companies,
            appliedToday: appliedToday.data.appliedToday || 0,
          });
        } else {
          setUserData({
            email: decoded.email,
            companies: companies,
            appliedToday: 0,
          });
          setError('Please upload a resume and select companies to start auto-applying.');
        }
      } catch (error: any) {
        console.error('Fetch user data failed:', error.message);
        if (error.response?.status === 404) {
          setError('Backend API not found. Please try again later or contact support at zvertex.247@gmail.com.');
        } else if (error.response?.status === 400) {
          setError(error.response.data.message || 'Setup incomplete. Please upload a resume and select companies.');
          navigate('/resume-upload');
        } else {
          setError('Failed to load user data. Please try again later or contact support at zvertex.247@gmail.com.');
        }
      }
    };
    if (isAuthenticated) fetchUserData();
  }, [isAuthenticated, navigate]);

  const handleUpload = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('token', token);
        try {
          await axios.post('https://zvertexai-orzv.onrender.com/api/upload-resume', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          localStorage.setItem('resumeUploaded', 'true');
          navigate('/companies');
        } catch (error: any) {
          alert('Upload failed: ' + (error.response?.data?.message || error.message));
        }
      }
    };
    input.click();
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://zvertexai-orzv.onrender.com/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.reload();
    } catch (error: any) {
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box className="twitter-layout">
      <Box className="left-sidebar glass-card">
        {!isAuthenticated ? (
          <>
            <Button onClick={() => navigate('/login')} sx={{ mb: 1, width: '100%' }}>Login</Button>
            <Button onClick={() => navigate('/signup')} sx={{ mb: 1, width: '100%' }}>Signup</Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate('/resume-upload')} sx={{ mb: 1, width: '100%' }}>Update Resume</Button>
            <Button onClick={() => navigate('/companies')} sx={{ mb: 1, width: '100%' }}>Update Companies</Button>
            <Button onClick={() => navigate('/confirm-auto-apply')} sx={{ mb: 1, width: '100%' }}>Auto Apply</Button>
            <Button onClick={() => alert('Connect to LinkedIn - Coming Soon')} sx={{ mb: 1, width: '100%' }}>Connect to LinkedIn</Button>
            <Button onClick={() => alert('Latest Trending Jobs - Coming Soon')} sx={{ mb: 1, width: '100%' }}>Latest Trending Jobs</Button>
          </>
        )}
      </Box>
      <Box className="middle-content">
        <Box className="glass-card" sx={{ textAlign: 'center' }}>
          {!isAuthenticated ? (
            <>
              <Button onClick={() => navigate('/signup')} sx={{ fontSize: '18px', py: 2, px: 4, mb: 3 }}>Get Started</Button>
              <Typography variant="h5" sx={{ mb: 3 }}>Welcome to ZvertexAI</Typography>
              <Typography sx={{ mb: 2 }}>
                Sign up with a one-time OTP verification to access our job auto-apply service for life.
              </Typography>
            </>
          ) : (
            <>
              <Button onClick={handleUpload} sx={{ fontSize: '18px', py: 2, px: 4, mb: 3 }}>Upload Resume</Button>
              <Typography variant="h5" sx={{ mb: 3 }}>Your Job Application Status</Typography>
              {userData ? (
                <>
                  <Typography sx={{ mb: 2 }}>Selected Companies: {userData.companies.join(', ') || 'None'}</Typography>
                  <Typography sx={{ mb: 2 }}>Jobs Applied Today: {userData.appliedToday}</Typography>
                  <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ px: 4, py: 1.5 }}>View Dashboard</Button>
                </>
              ) : (
                <Typography>Loading your data...</Typography>
              )}
              {error && <Typography sx={{ mt: 2, color: '#dc3545' }}>{error}</Typography>}
            </>
          )}
        </Box>
      </Box>
      <Box className="right-sidebar glass-card">
        {!isAuthenticated ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>New to ZvertexAI?</Typography>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <Button onClick={handleLogin} sx={{ mb: 2 }}>Log In</Button>
            <Button onClick={() => navigate('/signup')} sx={{ backgroundColor: '#28a745', color: '#fff' }}>Sign Up</Button>
          </>
        ) : (
          userData ? (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Welcome Back!</Typography>
              <Typography>Email: {userData.email}</Typography>
              <Typography>Companies: {userData.companies.join(', ') || 'None'}</Typography>
              <Typography>Jobs Today: {userData.appliedToday}</Typography>
            </>
          ) : (
            <Typography>Loading...</Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default StaticHomePage;