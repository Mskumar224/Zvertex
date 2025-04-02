import React, { useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';

function PaymentSuccess() {
  const history = useHistory();
  const location = useLocation();

  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = new URLSearchParams(location.search).get('session_id');
      if (sessionId) {
        try {
          const response = await axios.get(`${apiUrl}/api/payment/verify?session_id=${sessionId}`);
          if (response.data.success) {
            alert('Payment successful! You can now log in.');
          }
        } catch (error) {
          console.error('Payment Verification Error:', error);
          alert('Payment verification failed.');
        }
      }
    };
    verifyPayment();
  }, [location]);

  return (
    <div>
      <div className="hero">
        <Typography variant="h2">Payment Successful</Typography>
        <Typography variant="body1">Thank you for your payment! You can now log in.</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => history.push('/')}
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
}

export default PaymentSuccess;