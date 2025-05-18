import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import BusinessDashboard from './pages/BusinessDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/subscription" component={Subscription} />
        <Route path="/student-dashboard" component={StudentDashboard} />
        <Route path="/recruiter-dashboard" component={RecruiterDashboard} />
        <Route path="/business-dashboard" component={BusinessDashboard} />
      </Switch>
    </Router>
  );
}

export default App;