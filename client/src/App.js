import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
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
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${apiUrl}/api/auth/me`, {
        headers: { 'x-auth-token': token },
      })
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, [apiUrl]);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login">
          <Login user={user} setUser={setUser} />
        </Route>
        <Route path="/register">
          <Register user={user} setUser={setUser} />
        </Route>
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/dashboard">
          <Dashboard user={user} setUser={setUser} />
        </Route>
        <Route path="/zgpt">
          <ZGPT user={user} />
        </Route>
        <Route path="/contact-us">
          <ContactUs user={user} />
        </Route>
        <Route path="/faq" component={InterviewFAQs} />
        <Route path="/why-us" component={WhyZvertexAI} />
        <Route path="/projects" exact>
          <Projects user={user} />
        </Route>
        <Route path="/projects/saas">
          <SaaSProject user={user} />
        </Route>
        <Route path="/projects/cloud">
          <CloudProject user={user} />
        </Route>
        <Route path="/projects/ai">
          <AIProject user={user} />
        </Route>
        <Route path="/projects/bigdata">
          <BigDataProject user={user} />
        </Route>
        <Route path="/projects/devops">
          <DevOpsProject user={user} />
        </Route>
        <Route path="/resume-upload">
          <ResumeUpload user={user} setUser={setUser} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;