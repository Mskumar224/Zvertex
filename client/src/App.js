import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import JobDetails from './components/JobDetails';
import Faq from './components/Faq';
import WhyUs from './components/WhyUs';
import ZGPT from './components/ZGPT';
import Contact from './components/Contact';
import Project from './components/Project';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { 'x-auth-token': token },
        })
        .then((res) => setUser({ email: res.data.email, subscriptionType: res.data.subscriptionType }))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []); // Empty dependency array to run once on mount

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing user={user} setUser={setUser} />
        </Route>
        <Route path="/dashboard">
          <Dashboard user={user} setUser={setUser} />
        </Route>
        <Route path="/login">
          <Login user={user} setUser={setUser} />
        </Route>
        <Route path="/register">
          <Register user={user} setUser={setUser} />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword user={user} setUser={setUser} />
        </Route>
        <Route path="/reset-password/:token">
          <ResetPassword user={user} setUser={setUser} />
        </Route>
        <Route path="/job/:jobId">
          <JobDetails user={user} setUser={setUser} />
        </Route>
        <Route path="/faq">
          <Faq user={user} setUser={setUser} />
        </Route>
        <Route path="/why-us">
          <WhyUs user={user} setUser={setUser} />
        </Route>
        <Route path="/zgpt">
          <ZGPT user={user} setUser={setUser} />
        </Route>
        <Route path="/contact">
          <Contact user={user} setUser={setUser} />
        </Route>
        <Route path="/projects/:type">
          <Project user={user} setUser={setUser} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;