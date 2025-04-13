import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import {
  Home,
  Dashboard,
  Work,
  Build,
  QuestionAnswer,
  Info,
  ContactMail,
  ExitToApp,
} from '@mui/icons-material';

function Sidebar({ user, setUser, open, onClose }) {
  const history = useHistory();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    user && { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'AI Job Matching', icon: <Work />, path: '/ai-job-matching' },
    { text: 'Projects', icon: <Build />, path: '/projects' },
    { text: 'FAQs', icon: <QuestionAnswer />, path: '/faq' },
    { text: 'Why ZvertexAI', icon: <Info />, path: '/why-us' },
    { text: 'Contact', icon: <ContactMail />, path: '/contact' },
  ].filter(Boolean);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/login');
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: '#1e1e1e',
          color: 'white',
          width: 250,
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          ZvertexAI
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#424242' }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              history.push(item.path);
              onClose();
            }}
            sx={{
              '&:hover': { backgroundColor: '#ff6d00' },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      {user && (
        <>
          <Divider sx={{ backgroundColor: '#424242' }} />
          <List>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                '&:hover': { backgroundColor: '#ff6d00' },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </>
      )}
    </Drawer>
  );
}

export default Sidebar;