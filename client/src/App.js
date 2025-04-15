import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import Matches from './components/Matches';
import ZGPT from './components/Zgpt';
import Subscription from './components/Subscription';
import ContactUs from './components/ContactUs';
import WhyZvertexAI from './components/WhyZvertexAI';
import InterviewFAQs from './components/InterviewFAQs';
import ProjectAI from './components/ProjectAI';
import ProjectBigData from './components/ProjectBigData';
import ProjectCloud from './components/ProjectCloud';
import ProjectDevOps from './components/ProjectDevOps';
import ProjectSaaS from './components/ProjectSaas';
import Sidebar from './components/Sidebar';

function App() {
  const [user, setUser] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${apiUrl}/api/auth/user`, {
          headers: { 'x-auth-token': token },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, [apiUrl]);

  return (
    <Router>
      {user && <Sidebar user={user} setUser={setUser} />}
      <Header user={user} setUser={setUser} />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/login" component={() => <Login setUser={setUser} />} />
        <Route path="/register" component={() => <Register setUser={setUser} />} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/dashboard" component={() => <Dashboard user={user} />} />
        <Route path="/matches" component={() => <Matches user={user} />} />
        <Route path="/zgpt" component={() => <ZGPT user={user} />} />
        <Route path="/subscription" component={() => <Subscription user={user} setUser={setUser} />} />
        <Route path="/contact-us" component={ContactUs} />
        <Route path="/why-zvertexai" component={() => <WhyZvertexAI user={user} />} />
        <Route path="/interview-faqs" component={InterviewFAQs} />
        <Route path="/project-ai" component={() => <ProjectAI user={user} />} />
        <Route path="/project-bigdata" component={() => <ProjectBigData user={user} />} />
        <Route path="/project-cloud" component={() => <ProjectCloud user={user} />} />
        <Route path="/project-devops" component={() => <ProjectDevOps user={user} />} />
        <Route path="/project-saas" component={() => <ProjectSaaS user={user} />} />
      </Switch>
    </Router>
  );
}

export default App;