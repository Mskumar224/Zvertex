import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';

function Dashboard({ user }) {
  const history = useHistory();

  if (!user) {
    history.push('/');
    return null;
  }

  const isTestUser = user.subscriptionType === 'ALL';
  const subscriptionType = isTestUser ? 'Test User (All Access)' : user.subscriptionType;

  const features = {
    STUDENT: ['1 Resume', '35 Submissions/Day'],
    VENDOR: ['4 Resumes', '175 Submissions/Day'],
    BUSINESS: ['5 Recruiters Allowed', 'Custom Pricing'],
    ALL: ['1-4 Resumes', '35-175 Submissions/Day', '5 Recruiters Allowed', 'Full Access to All Features'],
  };

  return (
    <div>
      <div className="header">
        <h1>ZvertexAI</h1>
        <div className="nav-links">
          <a href="/" onClick={() => localStorage.removeItem('token')}>Logout</a>
        </div>
      </div>
      <div className="hero">
        <Typography variant="h2">Dashboard</Typography>
        <Typography variant="body1">Welcome, {subscriptionType} user!</Typography>
      </div>
      <Box sx={{ padding: '40px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Your Features</Typography>
        <Box sx={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
          {features[isTestUser ? 'ALL' : user.subscriptionType].map((feature, index) => (
            <Typography key={index} variant="body1" sx={{ mb: 1 }}>
              - {feature}
            </Typography>
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => alert('Feature coming soon!')}
        >
          Manage Resumes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3, ml: 2 }}
          onClick={() => alert('Feature coming soon!')}
        >
          View Submissions
        </Button>
        {(isTestUser || user.subscriptionType === 'BUSINESS') && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, ml: 2 }}
            onClick={() => alert('Business feature coming soon!')}
          >
            Manage Recruiters
          </Button>
        )}
      </Box>
    </div>
  );
}

export default Dashboard;