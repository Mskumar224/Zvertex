import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Contact from './components/Contact';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import InterviewFAQs from './components/InterviewFAQs';
import WhyZvertexAI from './components/WhyZvertexAI';
import Projects from './components/Projects';
import SaasProject from './components/SaasProject';
import CloudProject from './components/CloudProject';
import AIProject from './components/AIProject';
import BigDataProject from './components/BigDataProject';
import DevOpsProject from './components/DevOpsProject';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { 'x-auth-token': token },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing user={user} handleLogout={handleLogout} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} handleLogout={handleLogout} />} />
        <Route path="/contact" element={<Contact user={user} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/faq" element={<InterviewFAQs user={user} />} />
        <Route path="/why-us" element={<WhyZvertexAI user={user} />} />
        <Route path="/projects" element={<Projects user={user} />} />
        <Route path="/projects/saas" element={<SaasProject user={user} />} />
        <Route path="/projects/cloud" element={<CloudProject user={user} />} />
        <Route path="/projects/ai" element={<AIProject user={user} />} />
        <Route path="/projects/bigdata" element={<BigDataProject user={user} />} />
        <Route path="/projects/devops" element={<DevOpsProject user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;