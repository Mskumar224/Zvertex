import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Landing from './components/Landing';
import ZGPT from './components/ZGPT';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Contact from './components/Contact';
import AIJobMatching from './components/AIJobMatching';
import AIProjects from './components/AIProjects';
import SaaS from './components/SaaS';
import Cloud from './components/Cloud';
import AIAutomation from './components/AIAutomation';
import BigData from './components/BigData';
import DevOps from './components/DevOps';
import InterviewFAQs from './components/InterviewFAQs';
import WhyZvertexAI from './components/WhyZvertexAI';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { 'x-auth-token': token }
      })
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: '#1a2a44' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ZvertexAI
            </Typography>
            <Button color="inherit" sx={{ color: 'white' }} onClick={() => window.location.href = '/'}>Home</Button>
            <Button color="inherit" sx={{ color: 'white' }} onClick={() => window.location.href = '/zgpt'}>ZGPT</Button>
            <Button color="inherit" sx={{ color: 'white' }} onClick={() => window.location.href = '/projects'}>Projects</Button>
            <Button color="inherit" sx={{ color: 'white' }} onClick={() => window.location.href = '/faq'}>FAQs</Button>
            <Button color="inherit" sx={{ color: 'white' }} onClick={() => window.location.href = '/contact'}>Contact</Button>
            {user ? (
              <>
                <Button color="inherit" sx={{ color: 'white' }} onClick={() => window.location.href = '/dashboard'}>Dashboard</Button>
                <Button color="inherit" sx={{ color: 'white' }} onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" sx={{ color: 'white' }} onClick={() => window.location.href = '/login'}>Login</Button>
                <Button color="inherit" sx={{ color: 'white' }} onClick={() => window.location.href = '/register'}>Register</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path="/" render={() => <Landing user={user} />} />
          <Route path="/zgpt" render={() => <ZGPT user={user} />} />
          <Route path="/login" render={() => <Login setUser={setUser} />} />
          <Route path="/register" render={() => <Register setUser={setUser} />} />
          <Route path="/dashboard" render={() => user ? <Dashboard user={user} /> : <Redirect to="/login" />} />
          <Route path="/contact" render={() => <Contact user={user} />} />
          <Route path="/job-matching" render={() => <AIJobMatching user={user} />} />
          <Route path="/projects" render={() => <AIProjects user={user} />} />
          <Route path="/saas" render={() => <SaaS user={user} />} />
          <Route path="/cloud" render={() => <Cloud user={user} />} />
          <Route path="/ai-automation" render={() => <AIAutomation user={user} />} />
          <Route path="/big-data" render={() => <BigData user={user} />} />
          <Route path="/devops" render={() => <DevOps user={user} />} />
          <Route path="/faq" render={() => <InterviewFAQs user={user} />} />
          <Route path="/why-us" render={() => <WhyZvertexAI user={user} />} />
          <Route path="/forgot-password" render={() => <ForgotPassword user={user} />} />
          <Route path="/reset-password/:token" render={() => <ResetPassword user={user} />} />
        </Switch>
      </Box>
    </Router>
  );
}

export default App;