import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import axios from 'axios';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ZGPT from './components/ZGPT';
import ContactUs from './components/ContactUs';
import InterviewFAQs from './components/InterviewFAQs';
import WhyZvertexAI from './components/WhyZvertexAI';
import Projects from './components/Projects';
import SaaSProject from './components/SaaSProject';
import CloudProject from './components/CloudProject';
import AIProject from './components/AIProject';
import BigDataProject from './components/BigDataProject';
import DevOpsProject from './components/DevOpsProject';
import ResumeUpload from './components/ResumeUpload';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${apiUrl}/api/auth/me`, {
        headers: { 'x-auth-token': token },
      })
        .then(res => setUser(res.data))
        .catch(err => {
          console.error(err);
          localStorage.removeItem('token');
        });
    }
  }, [apiUrl]);

  return (
    <Router>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #121212 0%, #1a2a44 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Header user={user} setUser={setUser} />
        <Container maxWidth="lg" sx={{ flexGrow: 1, pt: 10, pb: 4 }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login">
              <Login setUser={setUser} apiUrl={apiUrl} />
            </Route>
            <Route path="/dashboard">
              <Dashboard user={user} apiUrl={apiUrl} />
            </Route>
            <Route path="/zgpt">
              <ZGPT user={user} apiUrl={apiUrl} />
            </Route>
            <Route path="/contact-us">
              <ContactUs apiUrl={apiUrl} />
            </Route>
            <Route path="/faq" component={InterviewFAQs} />
            <Route path="/why-us" component={WhyZvertexAI} />
            <Route path="/projects" component={Projects} />
            <Route path="/saas-project">
              <SaaSProject user={user} />
            </Route>
            <Route path="/cloud-project">
              <CloudProject user={user} />
            </Route>
            <Route path="/ai-project">
              <AIProject user={user} />
            </Route>
            <Route path="/bigdata-project">
              <BigDataProject user={user} />
            </Route>
            <Route path="/devops-project">
              <DevOpsProject user={user} />
            </Route>
            <Route path="/resume-upload">
              <ResumeUpload user={user} apiUrl={apiUrl} />
            </Route>
          </Switch>
        </Container>
        <Footer />
      </Box>
    </Router>
  );
}

function Header({ user, setUser }) {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'rgba(26, 42, 68, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Button
          onClick={() => history.push('/')}
          sx={{
            textTransform: 'none',
            color: '#ffffff',
            '&:hover': { color: '#00e676' },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
            ZvertexAI
          </Typography>
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => history.push('/')}
            sx={{ color: '#ffffff', '&:hover': { color: '#00e676' } }}
          >
            Home
          </Button>
          <Button
            onClick={() => history.push('/projects')}
            sx={{ color: '#ffffff', '&:hover': { color: '#00e676' } }}
          >
            Projects
          </Button>
          <Button
            onClick={() => history.push('/faq')}
            sx={{ color: '#ffffff', '&:hover': { color: '#00e676' } }}
          >
            FAQs
          </Button>
          <Button
            onClick={() => history.push('/contact-us')}
            sx={{ color: '#ffffff', '&:hover': { color: '#00e676' } }}
          >
            Contact
          </Button>
          {user ? (
            <>
              <Button
                onClick={() => history.push('/dashboard')}
                sx={{ color: '#ffffff', '&:hover': { color: '#00e676' } }}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => history.push('/zgpt')}
                sx={{ color: '#ffffff', '&:hover': { color: '#00e676' } }}
              >
                ZGPT
              </Button>
              <Button
                onClick={() => history.push('/resume-upload')}
                sx={{ color: '#ffffff', '&:hover': { color: '#00e676' } }}
              >
                Resume
              </Button>
              <Button
                onClick={handleLogout}
                sx={{ color: '#ffffff', '&:hover': { color: '#ff6d00' } }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={() => history.push('/login')}
              sx={{ color: '#ffffff', '&:hover': { color: '#ff6d00' } }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default App;