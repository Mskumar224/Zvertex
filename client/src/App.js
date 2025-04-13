import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Zgpt from './components/Zgpt';

const App = () => (
  <Router>
    <main style={{ minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/zgpt" element={<Zgpt />} />
      </Routes>
    </main>
  </Router>
);

export default App;