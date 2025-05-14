import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { ThemeProvider, createTheme, AppBar, Toolbar, Typography, Container, Box, Link, Button } from '@mui/material';
import Signup from './pages/Signup';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import JobApply from './pages/JobApply';

const theme = createTheme({
  palette: { primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' }, secondary: { main: '#f50057' }, background: { default: '#f5f5f5', paper: '#ffffff' } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', h4: { fontWeight: 600, fontSize: '2rem', '@media (max-width:600px)': { fontSize: '1.5rem' } }, h5: { fontWeight: 600, fontSize: '1.5rem', '@media (max-width:600px)': { fontSize: '1.25rem' } }, body1: { fontSize: '1rem', '@media (max-width:600px)': { fontSize: '0.875rem' } } },
  components: { MuiButton: { styleOverrides: { root: { borderRadius: '25px', textTransform: 'none', fontWeight: 500, padding: '10px 24px' }, containedPrimary: { background: 'linear-gradient(45deg, #1976d2, #42a5f5)', '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)' } } } }, MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: '8px' } } } }, MuiSelect: { styleOverrides: { root: { borderRadius: '8px' } } } },
});

function Header() {
  const history = useHistory();
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Button onClick={() => history.push('/login')} sx={{ flexGrow: 1, justifyContent: 'flex-start' }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>ZvertexAI</Typography>
        </Button>
        <Link href="/signup" color="inherit" sx={{ mx: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Signup</Link>
        <Link href="/login" color="inherit" sx={{ mx: 2, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Login</Link>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <Container maxWidth="lg" sx={{ minHeight: 'calc(100vh - 128px)', py: 4 }}>
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/student-dashboard" component={StudentDashboard} />
            <Route exact path="/job-apply" component={JobApply} />
            <Redirect from="/" to="/login" />
          </Switch>
        </Container>
        <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 2, textAlign: 'center', mt: 'auto' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} ZvertexAI. All rights reserved. |{' '}
            <Link href="mailto:zvertex.247@gmail.com" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Contact Us</Link>
          </Typography>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;