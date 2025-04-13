import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import StudentDashboard from './components/StudentDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import BusinessDashboard from './components/BusinessDashboard';
import Sidebar from './components/Sidebar';
import AIProjects from './components/AIProjects';
import AIJobMatching from './components/AIJobMatching';
import Zgpt from './components/Zgpt';
import FAQ from './components/FAQ';
import WhyUs from './components/WhyUs';
import Contact from './components/Contact';
import ProjectSaas from './components/ProjectSaas';
import ProjectCloud from './components/ProjectCloud';
import ProjectAI from './components/ProjectAI';
import ProjectBigData from './components/ProjectBigData';
import ProjectDevOps from './components/ProjectDevOps';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${apiUrl}/api/auth`, {
          headers: { 'x-auth-token': token },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  return (
    <Router>
      <Sidebar
        user={user}
        setUser={setUser}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Switch>
        <Route exact path="/">
          <Landing user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login setUser={setUser} />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/reset-password/:token">
          <ResetPassword />
        </Route>
        <Route path="/dashboard">
          {user?.subscriptionType === 'Student' && (
            <StudentDashboard user={user} setSidebarOpen={setSidebarOpen} />
          )}
          {user?.subscriptionType === 'Recruiter' && (
            <RecruiterDashboard user={user} setSidebarOpen={setSidebarOpen} />
          )}
          {user?.subscriptionType === 'Business' && (
            <BusinessDashboard user={user} setSidebarOpen={setSidebarOpen} />
          )}
        </Route>
        <Route path="/ai-job-matching">
          <AIJobMatching user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
        <Route path="/projects">
          <AIProjects user={user} />
        </Route>
        <Route path="/projects/saas">
          <ProjectSaas user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
        <Route path="/projects/cloud">
          <ProjectCloud user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
        <Route path="/projects/ai">
          <ProjectAI user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
        <Route path="/projects/bigdata">
          <ProjectBigData user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
        <Route path="/projects/devops">
          <ProjectDevOps user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
        <Route path="/zgpt">
          <Zgpt user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
        <Route path="/faq">
          <FAQ user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
        <Route path="/why-us">
          <WhyUs user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
        <Route path="/contact">
          <Contact user={user} setSidebarOpen={setSidebarOpen} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;