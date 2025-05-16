import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import InfoIcon from '@mui/icons-material/Info';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LogoutIcon from '@mui/icons-material/Logout';
import CodeIcon from '@mui/icons-material/Code';

function Sidebar({ user, setUser }) {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'ZGPT Copilot', icon: <ChatIcon />, path: '/zgpt' },
    { text: 'Why ZvertexAI?', icon: <InfoIcon />, path: '/why-zvertexai' },
    { text: 'Interview FAQs', icon: <QuestionAnswerIcon />, path: '/interview-faqs' },
    { text: 'Prompt Engineer', icon: <CodeIcon />, path: '/prompt-engineer' },
    { text: 'Contact Us', icon: <ContactMailIcon />, path: '/contact-us' },
  ];

  return (
    <Box
      sx={{
        width: '250px',
        backgroundColor: '#1a2a44',
        color: 'white',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        ZvertexAI
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', opacity: 0.8 }}>
        Powered by Zoho Prompt Engineering
      </Typography>
      <Divider sx={{ backgroundColor: 'white', mb: 2 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => history.push(item.path)}
            sx={{
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              borderRadius: '8px',
              mb: 1,
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ backgroundColor: 'white', mb: 2 }} />
      <Button
        startIcon={<LogoutIcon />}
        sx={{ color: 'white', justifyContent: 'flex-start', textTransform: 'none' }}
        onClick={handleLogout}
      >
        Logout
      </Button>
      <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', opacity: 0.6 }}>
        {user?.subscriptionType || 'Guest'} Mode
      </Typography>
    </Box>
  );
}

export default Sidebar;