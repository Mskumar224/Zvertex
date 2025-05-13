import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Button, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';

function Sidebar({ drawerWidth, isMobile }) {
  const token = localStorage.getItem('token');
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const sidebarItems = [
    { text: 'Discover Jobs', path: '/', desc: 'AI-powered job search for your career' },
    { text: 'Student Plan', path: '/student-dashboard', desc: 'Auto-apply to top jobs' },
    { text: 'Recruiter Tools', path: '/recruiter-dashboard', desc: 'Manage up to 5 profiles' },
    { text: 'Business Growth', path: '/business-dashboard', desc: 'Scale with 3 recruiters' },
    { text: 'ZGpt Search', path: '/zgpt', desc: 'Instant answers for job seekers' },
  ];

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1976d2, #115293)',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{ cursor: 'pointer', mb: 3, fontWeight: 'bold' }}
          onClick={() => window.location.href = '/'}
        >
          ZvertexAI
        </Typography>
        <List>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => history.push(item.path)}
              sx={{
                borderRadius: '8px',
                mx: 2,
                mb: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <ListItemText
                primary={item.text}
                secondary={item.desc}
                primaryTypographyProps={{ fontWeight: 'medium' }}
                secondaryTypographyProps={{ style: { color: '#bbdefb' } }}
              />
            </ListItem>
          ))}
          {token ? (
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: '8px',
                mx: 2,
                mt: 2,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2, mx: 2, borderRadius: '25px' }}
                onClick={() => history.push('/signup')}
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 1, mx: 2, borderRadius: '25px', color: '#fff', borderColor: '#fff' }}
                onClick={() => history.push('/login')}
              >
                Login
              </Button>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;