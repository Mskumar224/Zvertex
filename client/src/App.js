import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PaymentSuccess from './components/PaymentSuccess'; // Add this
import './styles.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={(props) => <Login {...props} setUser={setUser} />} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" render={(props) => <Dashboard {...props} user={user} />} />
        <Route path="/payment-success" component={PaymentSuccess} /> {/* Add this */}
      </Switch>
    </Router>
  );
}

export default App;