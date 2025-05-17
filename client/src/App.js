import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import AIJobMatching from './components/AIJobMatching';
import AIProjects from './components/AIProjects';
import ContactUs from './components/ContactUs';
import InterviewFAQs from './components/InterviewFAQs';
import ProjectAI from './components/ProjectAI';
import ProjectBigData from './components/ProjectBigData';
import ProjectCloud from './components/ProjectCloud';
import ProjectDevOps from './components/ProjectDevOps';
import ProjectSaaS from './components/ProjectSaaS';
import PromptEngineer from './components/PromptEngineer';
import WhyZvertexAI from './components/WhyZvertexAI';
import ZGPT from './components/ZGPT';

function App() {
  const [user, setUser] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`${apiUrl}/api/auth/me`, {
            headers: { 'x-auth-token': token },
          });
          setUser(res.data);
        }
      } catch (err) {
        localStorage.removeItem('token');
      }
    };
    fetchUser();
  }, [apiUrl]);

  return (
    <Router>
      <Switch>
        <Route path="/dashboard">
          <Dashboard user={user} setUser={setUser} />
        </Route>
        <Route path="/login">
          <Login setUser={setUser} />
        </Route>
        <Route path="/reset-password/:token">
          <ResetPassword />
        </Route>
        <Route path="/ai-job-matching">
          <AIJobMatching />
        </Route>
        <Route path="/ai-projects">
          <AIProjects />
        </Route>
        <Route path="/contact-us">
          <ContactUs />
        </Route>
        <Route path="/interview-faqs">
          <InterviewFAQs />
        </Route>
        <Route path="/project-ai">
          <ProjectAI />
        </Route>
        <Route path="/project-big-data">
          <ProjectBigData />
        </Route>
        <Route path="/project-cloud">
          <ProjectCloud />
        </Route>
        <Route path="/project-devops">
          <ProjectDevOps />
        </Route>
        <Route path="/project-saas">
          <ProjectSaaS />
        </Route>
        <Route path="/prompt-engineer">
          <PromptEngineer />
        </Route>
        <Route path="/why-zvertexai">
          <WhyZvertexAI />
        </Route>
        <Route path="/zgpt">
          <ZGPT />
        </Route>
        <Route path="/">
          <Login setUser={setUser} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;