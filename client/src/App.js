import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import Zgpt from './components/Zgpt'; // New Zgpt component
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com'}/api/auth/me`, {
        headers: { 'x-auth-token': token },
      })
      .then(res => setUser({ subscriptionType: res.data.subscriptionType }))
      .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/login" component={() => <Login setUser={setUser} />} />
        <Route path="/register" component={() => <Register setUser={setUser} />} />
        <Route path="/dashboard" component={() => <Dashboard user={user} />} />
        <Route path="/zgpt" component={Zgpt} /> {/* New route */}
      </Switch>
    </Router>
  );
}

export default App;