import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import SubscriptionForm from './components/SubscriptionForm';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/subscription-form" component={SubscriptionForm} />
        <Route path="/student-dashboard" component={StudentDashboard} />
      </Switch>
    </Router>
  );
}

export default App;