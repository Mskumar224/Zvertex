import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const ConfirmAction = () => {
  const { token } = useParams();
  const history = useHistory();
  const [message, setMessage] = useState('Verifying...');
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    const confirmAction = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/auth/confirm-action/${token}`);
        setMessage(res.data.msg);
        setTimeout(() => history.push('/dashboard'), 2000);
      } catch (err) {
        console.error('Confirmation error:', err);
        setMessage(err.response?.data?.msg || 'Failed to confirm action');
      } finally {
        setLoading(false);
      }
    };
    confirmAction();
  }, [token, history, apiUrl]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)' }}>
      <Box sx={{ textAlign: 'center', color: 'white' }}>
        {loading ? <CircularProgress color="inherit" /> : <Typography variant="h5">{message}</Typography>}
      </Box>
    </Box>
  );
};

export default ConfirmAction;