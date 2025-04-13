import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import WhyZvertexAI from './components/WhyZvertexAI';
import InterviewFAQs from './components/InterviewFAQs';
import ZGPT from './components/Zgpt';
import ContactUs from './components/ContactUs';
import Subscription from './components/Subscription';
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
      <Switch>
        <Route exact path="/">
          <Landing user={user} setUser={setUser} />
        </Route>
        <Route path="/login">
          {user ? <Redirect to="/dashboard" /> : <Login setUser={setUser} />}
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/dashboard" /> : <Register setUser={setUser} />}
        </Route>
        <Route path="/forgot-password">
          {user ? <Redirect to="/dashboard" /> : <ForgotPassword />}
        </Route>
        <Route path="/reset-password/:token">
          {user ? <Redirect to="/dashboard" /> : <ResetPassword />}
        </Route>
        <Route path="/dashboard">
          {user ? <Dashboard user={user} setUser={setUser} /> : <Redirect to="/login" />}
        </Route>
        <Route path="/why-zvertexai">
          <WhyZvertexAI user={user} />
        </Route>
        <Route path="/interview-faqs">
          <InterviewFAQs user={user} />
        </Route>
        <Route path="/zgpt">
          <ZGPT user={user} />
        </Route>
        <Route path="/contact-us">
          <ContactUs user={user} />
        </Route>
        <Route path="/subscription">
          {user ? <Subscription user={user} setUser={setUser} /> : <Redirect to="/login" />}
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;