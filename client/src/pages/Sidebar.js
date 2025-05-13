import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Button, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';

function Sidebar() {
  const history = useHistory();

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Student Benefits', path: '/student-dashboard', content: 'Auto-apply to jobs tailored to your skills and preferences!' },
    { text: 'Recruiter Tools', path: '/recruiter-dashboard', content: 'Manage up to 5 profiles and automate job applications!' },
    { text: 'Business Solutions', path: '/business-dashboard', content: 'Oversee 3 recruiters, each handling 5 profiles for maximum efficiency!' },
    { text: 'Job Application', path: '/job-apply', content: 'Select technologies and companies for seamless auto-apply!' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          background: '#1976d2',
          color: '#fff',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          ZvertexAI
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => history.push(item.path)} sx={{ flexDirection: 'column', alignItems: 'flex-start', p: 2 }}>
            <ListItemText primary={item.text} />
            <Typography variant="caption" sx={{ color: '#e3f2fd', mt: 1 }}>
              {item.content}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ borderRadius: '25px' }}
          onClick={() => history.push('/signup')}
        >
          Subscribe Now
        </Button>
      </Box>
    </Drawer>
  );
}

export default Sidebar;