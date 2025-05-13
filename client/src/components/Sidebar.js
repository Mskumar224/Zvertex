import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Button, Box, Divider } from '@mui/material';
import { useHistory } from 'react-router-dom';

function Sidebar() {
  const history = useHistory();
  const sidebarWidth = 260;

  const menuItems = [
    { text: 'Home', path: '/', content: 'Explore ZvertexAI features' },
    { text: 'Student Benefits', path: '/student-dashboard', content: 'Auto-apply to jobs tailored to your skills!' },
    { text: 'Recruiter Tools', path: '/recruiter-dashboard', content: 'Manage up to 5 profiles effortlessly!' },
    { text: 'Business Solutions', path: '/business-dashboard', content: 'Oversee 3 recruiters for maximum efficiency!' },
    { text: 'Job Application', path: '/job-apply', content: 'Select tech and companies for seamless auto-apply!' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sidebarWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
          color: '#fff',
          padding: '16px',
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, letterSpacing: 1 }}>
          ZvertexAI
        </Typography>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => history.push(item.path)}
            sx={{
              borderRadius: '8px',
              mb: 1,
              py: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <Box>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
              <Typography variant="caption" sx={{ color: '#e3f2fd', ml: 2 }}>
                {item.content}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{
            borderRadius: '12px',
            py: 1.5,
            fontSize: '1rem',
            backgroundColor: '#dc004e',
            '&:hover': {
              backgroundColor: '#c00345',
              transform: 'translateY(-1px)',
            },
          }}
          onClick={() => history.push('/signup')}
        >
          Subscribe Now
        </Button>
      </Box>
    </Drawer>
  );
}

export default Sidebar;