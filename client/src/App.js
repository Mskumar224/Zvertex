import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import JobApply from './pages/JobApply';
import Header from './components/Header';
import Footer from './components/Footer';
import { Box } from '@mui/material';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ flexGrow: 1 }}>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/student-dashboard" component={StudentDashboard} />
            <Route path="/recruiter-dashboard" component={RecruiterDashboard} />
            <Route path="/business-dashboard" component={BusinessDashboard} />
            <Route path="/job-apply" component={JobApply} />
          </Switch>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;