import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ResumeUpload from './components/ResumeUpload';
import Profile from './components/Profile';

const App = () => (
  <Router>
    <Header />
    <main style={{ minHeight: '80vh', padding: '20px' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </main>
    <Footer />
  </Router>
);

export default App;