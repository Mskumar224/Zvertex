import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import JobApply from './pages/JobApply';
import Saas from './pages/Saas';
import ZOHA from './pages/ZOHA'; 
import Petmic from './pages/Petmic';

const drawerWidth = 280;

function App() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        <CssBaseline />
        <Sidebar drawerWidth={drawerWidth} isMobile={isMobile} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, background: '#f5f5f5', minHeight: '100vh' }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/subscription" component={Subscription} />
            <Route path="/student-dashboard" component={StudentDashboard} />
            <Route path="/recruiter-dashboard" component={RecruiterDashboard} />
            <Route path="/business-dashboard" component={BusinessDashboard} />
            <Route path="/job-apply" component={JobApply} />
            <Route path="/saas" component={Saas} />
            <Route path="/zoha" component={ZOHA} />  
            <Route path="/petmic" component={Petmic} />
            <Route path="*" render={() => <Redirect to="/" />} />
          </Switch>
        </Box>
      </Box>
    </Router>
  );
}

export default App;