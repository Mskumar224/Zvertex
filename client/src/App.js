import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
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

  const noHeaderRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  return (
    <Router>
      <Switch>
        {['/'].map(path => (
          <Route exact path={path} key={path}>
            <Header user={user} setUser={setUser} />
            <Landing user={user} setUser={setUser} />
          </Route>
        ))}
        {['/login'].map(path => (
          <Route path={path} key={path}>
            {user ? <Redirect to="/dashboard" /> : <Login setUser={setUser} />}
          </Route>
        ))}
        {['/register'].map(path => (
          <Route path={path} key={path}>
            {user ? <Redirect to="/dashboard" /> : <Register setUser={setUser} />}
          </Route>
        ))}
        {['/forgot-password'].map(path => (
          <Route path={path} key={path}>
            {user ? <Redirect to="/dashboard" /> : <ForgotPassword />}
          </Route>
        ))}
        {['/reset-password/:token'].map(path => (
          <Route path={path} key={path}>
            {user ? <Redirect to="/dashboard" /> : <ResetPassword />}
          </Route>
        ))}
        {['/dashboard'].map(path => (
          <Route path={path} key={path}>
            <Header user={user} setUser={setUser} />
            {user ? <Dashboard user={user} setUser={setUser} /> : <Redirect to="/login" />}
          </Route>
        ))}
        {['/why-zvertexai'].map(path => (
          <Route path={path} key={path}>
            <Header user={user} setUser={setUser} />
            <WhyZvertexAI user={user} />
          </Route>
        ))}
        {['/interview-faqs'].map(path => (
          <Route path={path} key={path}>
            <Header user={user} setUser={setUser} />
            <InterviewFAQs user={user} />
          </Route>
        ))}
        {['/zgpt'].map(path => (
          <Route path={path} key={path}>
            <Header user={user} setUser={setUser} />
            <ZGPT user={user} />
          </Route>
        ))}
        {['/contact-us'].map(path => (
          <Route path={path} key={path}>
            <Header user={user} setUser={setUser} />
            <ContactUs user={user} />
          </Route>
        ))}
        {['/subscription'].map(path => (
          <Route path={path} key={path}>
            <Header user={user} setUser={setUser} />
            {user ? <Subscription user={user} setUser={setUser} /> : <Redirect to="/login" />}
          </Route>
        ))}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;