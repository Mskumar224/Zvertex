import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import JobDetails from './components/JobDetails';
import Faq from './components/Faq';
import WhyUs from './components/WhyUs';
import ZGPT from './components/ZGPT';
import Contact from './components/Contact';
import Project from './components/Project';
import jwtDecode from 'jwt-decode';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.email, subscriptionType: decoded.subscriptionType });
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Landing user={user} setUser={setUser} />
        </Route>
        <Route path="/login">
          <Login user={user} setUser={setUser} />
        </Route>
        <Route path="/register">
          <Register user={user} setUser={setUser} />
        </Route>
        <Route path="/dashboard">
          <Dashboard user={user} setUser={setUser} />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/reset-password/:token">
          <ResetPassword />
        </Route>
        <Route path="/job/:id">
          <JobDetails user={user} />
        </Route>
        <Route path="/faq">
          <Faq />
        </Route>
        <Route path="/why-us">
          <WhyUs />
        </Route>
        <Route path="/zgpt">
          <ZGPT />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/projects/:type">
          <Project user={user} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;