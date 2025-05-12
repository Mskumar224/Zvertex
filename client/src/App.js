import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import JobPreferences from './pages/JobPreferences';
import StudentDashboard from './pages/StudentDashboard';
import RestrictedFeature from './components/RestrictedFeature';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/job-preferences" component={JobPreferences} />
        <Route path="/student-dashboard" component={StudentDashboard} />
        <Route path="/restricted" component={RestrictedFeature} />
      </Switch>
    </Router>
  );
}

export default App;