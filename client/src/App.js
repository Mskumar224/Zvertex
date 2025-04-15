import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
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
import ProjectSaaS from './components/ProjectSaaS';

function ProtectedRoute({ component: Component, user, setUser, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        user && localStorage.getItem('token') ? (
          <Component {...props} user={user} setUser={setUser} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

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
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error('Token validation failed:', err.response?.status);
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, [apiUrl]);

  return (
    <Router>
      {user && <Sidebar user={user} setUser={setUser} />}
      <Header user={user} setUser={setUser} />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/login" render={(props) => <Login {...props} setUser={setUser} />} />
        <Route exact path="/register" render={(props) => <Register {...props} setUser={setUser} />} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reset-password/:token" component={ResetPassword} />
        <Route exact path="/contact-us" component={ContactUs} />
        <Route exact path="/why-zvertexai" render={(props) => <WhyZvertexAI {...props} user={user} />} />
        <Route exact path="/interview-faqs" component={InterviewFAQs} />
        <ProtectedRoute exact path="/dashboard" component={Dashboard} user={user} setUser={setUser} />
        <ProtectedRoute exact path="/matches" component={Matches} user={user} setUser={setUser} />
        <ProtectedRoute exact path="/zgpt" component={ZGPT} user={user} setUser={setUser} />
        <ProtectedRoute exact path="/subscription" component={Subscription} user={user} setUser={setUser} />
        <ProtectedRoute exact path="/project-ai" component={ProjectAI} user={user} setUser={setUser} />
        <ProtectedRoute exact path="/project-bigdata" component={ProjectBigData} user={user} setUser={setUser} />
        <ProtectedRoute exact path="/project-cloud" component={ProjectCloud} user={user} setUser={setUser} />
        <ProtectedRoute exact path="/project-devops" component={ProjectDevOps} user={user} setUser={setUser} />
        <ProtectedRoute exact path="/project-saas" component={ProjectSaaS} user={user} setUser={setUser} />
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
}

export default App;