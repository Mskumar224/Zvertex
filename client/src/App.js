import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DocumentUpload from './components/DocumentUpload';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={() => <Login setUser={setUser} />} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={() => <Dashboard user={user} setUser={setUser} />} />
        <Route path="/upload" component={DocumentUpload} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
      </Switch>
    </Router>
  );
}

export default App;