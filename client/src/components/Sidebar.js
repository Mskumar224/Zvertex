import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Divider } from '@mui/material';

function Sidebar({ user, setUser }) {
  const history = useHistory();

  const sidebarItems = [
    {
      title: 'Explore Jobs',
      description: 'Find opportunities tailored to your skills.',
      path: '/dashboard',
      for: ['STUDENT', 'RECRUITER', 'BUSINESS'],
    },
    {
      title: 'Join Projects',
      description: 'Contribute to AI and Cloud initiatives.',
      path: '/ai-projects',
      for: ['STUDENT', 'RECRUITER', 'BUSINESS'],
    },
    {
      title: 'Chat with ZGPT',
      description: 'Get career advice anytime.',
      path: '/zgpt',
      for: ['STUDENT', 'RECRUITER', 'BUSINESS'],
    },
    {
      title: 'Manage Profiles',
      description: 'Handle multiple resumes for your team.',
      path: '/dashboard',
      for: ['RECRUITER', 'BUSINESS'],
    },
    {
      title: 'Recruiter Hub',
      description: 'Oversee your recruiters.',
      path: '/dashboard',
      for: ['BUSINESS'],
    },
  ];

  return (
    <Box sx={{
      width: '250px',
      backgroundColor: '#1a2a44',
      color: 'white',
      height: '100vh',
      p: 2,
      position: 'fixed',
      top: 0,
      left: 0,
      overflowY: 'auto',
    }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        ZvertexAI
      </Typography>
      <Divider sx={{ backgroundColor: 'white', mb: 2 }} />
      {sidebarItems
        .filter(item => item.for.includes(user.subscriptionType))
        .map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Button
              fullWidth
              sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none' }}
              onClick={() => history.push(item.path)}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
            </Button>
            <Typography variant="body2" sx={{ color: '#b0b0b0', ml: 2 }}>{item.description}</Typography>
          </Box>
        ))}
      <Divider sx={{ backgroundColor: 'white', mb: 2 }} />
      <Button
        fullWidth
        variant="outlined"
        sx={{ color: 'white', borderColor: 'white' }}
        onClick={() => {
          localStorage.removeItem('token');
          setUser(null);
          history.push('/login');
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

export default Sidebar;