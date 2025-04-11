import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import ZGPT from './components/Zgpt';
import JobDetails from './components/JobDetails';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      axios
        .get(`${process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com'}/api/auth/me`, {
          headers: { 'x-auth-token': token },
        })
        .then((res) => {
          setUser({ email: res.data.email, subscriptionType: res.data.subscriptionType });
          setCheckedAuth(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
          setCheckedAuth(true);
        });
    } else {
      setCheckedAuth(true);
    }
  }, [user]);

  if (!checkedAuth) return null;

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={() => <Landing user={user} />} />
        <Route path="/login" component={() => <Login setUser={setUser} user={user} />} />
        <Route path="/register" component={() => <Register setUser={setUser} user={user} />} />
        <Route path="/dashboard" component={() => <Dashboard user={user} />} />
        <Route path="/zgpt" component={() => <ZGPT user={user} />} />
        <Route path="/job/:jobId" component={() => <JobDetails user={user} />} />
      </Switch>
    </Router>
  );
}

export default App;