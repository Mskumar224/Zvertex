import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import StaticHomePage from './components/StaticHomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ResumeUpload from './pages/ResumeUpload';
import Companies from './pages/Companies';
import ConfirmAutoApply from './pages/ConfirmAutoApply';
import Dashboard from './pages/Dashboard';

// Define navy blue and white theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#003087', // Navy blue
      contrastText: '#FFFFFF', // White
    },
    secondary: {
      main: '#FFFFFF', // White
      contrastText: '#003087', // Navy blue
    },
    background: {
      default: '#F5F7FA', // Light grey for background
      paper: '#FFFFFF', // White for paper elements
    },
    text: {
      primary: '#003087', // Navy blue
      secondary: '#FFFFFF', // White
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#003087',
          color: '#FFFFFF',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#FFFFFF',
            color: '#003087',
          },
        },
        containedPrimary: {
          backgroundColor: '#003087',
          color: '#FFFFFF',
        },
        outlinedSecondary: {
          borderColor: '#FFFFFF',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#003087',
            color: '#FFFFFF',
          },
        },
        outlinedPrimary: {
          borderColor: '#003087',
          color: '#003087',
          '&:hover': {
            backgroundColor: '#F5F7FA',
            color: '#003087',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#003087',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: '#FFFFFF',
            color: '#003087',
          },
          '& .MuiInputLabel-root': {
            color: '#003087',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#003087',
            },
            '&:hover fieldset': {
              borderColor: '#FFFFFF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#003087',
            },
          },
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

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ZvertexAI
        </Typography>
        {!isAuthPage && (
          <>
            {isAuthenticated && isOtpVerified ? (
              <>
                <Button color="inherit" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button color="inherit" onClick={() => navigate('/resume-upload')}>
                  Upload Resume
                </Button>
                <Button color="inherit" onClick={() => navigate('/companies')}>
                  Companies
                </Button>
                <Button color="inherit" onClick={() => navigate('/confirm-auto-apply')}>
                  Auto Apply
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate('/signup')}>
                  Signup
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

const Footer: React.FC = () => (
  <Box sx={{ bgcolor: '#003087', py: 3, mt: 'auto' }}>
    <Container maxWidth="lg">
      <Typography variant="body2" sx={{ color: '#FFFFFF' }} align="center">
        © {new Date().getFullYear()} ZvertexAI. All rights reserved. Contact us at{' '}
        <a href="mailto:zvertex.247@gmail.com" style={{ color: '#FFFFFF', textDecoration: 'underline' }}>
          zvertex.247@gmail.com
        </a>.
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
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4, bgcolor: '#FFFFFF' }}>
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