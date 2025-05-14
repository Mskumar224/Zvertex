import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
  createTheme,
  ThemeProvider,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import StaticHomePage from './components/StaticHomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResumeUpload from './pages/ResumeUpload';
import Companies from './pages/Companies';
import ConfirmAutoApply from './pages/ConfirmAutoApply';
import Dashboard from './pages/Dashboard';

// Define professional blue and white theme with MNC aesthetic
const theme = createTheme({
  palette: {
    primary: {
      main: '#005B99', // Deep professional blue
      contrastText: '#FFFFFF', // White
    },
    secondary: {
      main: '#FFFFFF', // White
      contrastText: '#005B99', // Deep blue
    },
    background: {
      default: '#F5F6F5', // Light neutral grey for background
      paper: '#FFFFFF', // White for paper elements
    },
    text: {
      primary: '#1A2526', // Dark grey for text
      secondary: '#FFFFFF', // White
    },
    success: {
      main: '#4CAF50', // Green for success messages
    },
    error: {
      main: '#D32F2F', // Red for error messages
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1A2526',
      fontSize: { xs: '1.5rem', sm: '2rem' }, // Responsive font size
    },
    h6: {
      fontWeight: 500,
      color: '#1A2526',
      fontSize: { xs: '1rem', sm: '1.25rem' },
    },
    body1: {
      color: '#1A2526',
      fontSize: { xs: '0.875rem', sm: '1rem' },
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#005B99',
          color: '#FFFFFF',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
          padding: { xs: '6px 12px', sm: '8px 16px' },
          fontWeight: 500,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          '&:hover': {
            backgroundColor: '#E6F0FA',
            color: '#005B99',
          },
        },
        containedPrimary: {
          backgroundColor: '#005B99',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#004B7F',
          },
        },
        outlinedPrimary: {
          borderColor: '#005B99',
          color: '#005B99',
          '&:hover': {
            backgroundColor: '#E6F0FA',
            borderColor: '#004B7F',
          },
        },
        outlinedSecondary: {
          borderColor: '#FFFFFF',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#005B99',
            borderColor: '#FFFFFF',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#1A2526',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: '#FFFFFF',
            color: '#1A2526',
            borderRadius: '6px',
          },
          '& .MuiInputLabel-root': {
            color: '#1A2526',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#005B99',
            },
            '&:hover fieldset': {
              borderColor: '#004B7F',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#005B99',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1A2526',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#005B99',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#004B7F',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#005B99',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: '6px',
          marginBottom: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setIsOtpVerified(decoded.isOtpVerified || false);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('resumeUploaded');
    localStorage.removeItem('selectedCompanies');
    setIsOtpVerified(false);
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname);

  const navItems = isAuthenticated && isOtpVerified
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Upload Resume', path: '/resume-upload' },
        { label: 'Companies', path: '/companies' },
        { label: 'Auto Apply', path: '/confirm-auto-apply' },
        { label: 'Logout', action: handleLogout },
      ]
    : [
        { label: 'Login', path: '/login' },
        { label: 'Signup', path: '/signup' },
      ];

  const drawer = (
    <Box sx={{ width: 250, bgcolor: '#FFFFFF', height: '100%' }}>
      <Typography variant="h6" sx={{ p: 2, color: '#005B99', fontWeight: 600 }}>
        ZvertexAI
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            onClick={() => {
              if (item.path) navigate(item.path);
              if (item.action) item.action();
              setMobileOpen(false);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemText primary={item.label} primaryTypographyProps={{ color: '#1A2526' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' }, textTransform: 'none' }}
        >
          ZvertexAI
        </Button>
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{ display: { xs: 'block', sm: 'none' } }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          !isAuthPage && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => (item.path ? navigate(item.path) : item.action?.())}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )
        )}
      </Toolbar>
    </AppBar>
  );
};

const Footer: React.FC = () => (
  <Box sx={{ bgcolor: '#005B99', py: { xs: 2, sm: 3 }, mt: 'auto' }}>
    <Container maxWidth="lg">
      <Typography
        variant="body2"
        sx={{ color: '#FFFFFF', textAlign: 'center', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
      >
        © {new Date().getFullYear()} ZvertexAI. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const decoded = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1]));
      if (!decoded.isOtpVerified) {
        navigate('/login');
      } else {
        setIsOtpVerified(true);
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !isOtpVerified) {
    return null;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Container
            maxWidth={isMobile ? 'sm' : 'lg'}
            sx={{ flexGrow: 1, py: { xs: 2, sm: 4 }, bgcolor: '#FFFFFF' }}
          >
            <Routes>
              <Route path="/" element={<StaticHomePage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/resume-upload"
                element={
                  <ProtectedRoute>
                    <ResumeUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companies"
                element={
                  <ProtectedRoute>
                    <Companies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/confirm-auto-apply"
                element={
                  <ProtectedRoute>
                    <ConfirmAutoApply />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;