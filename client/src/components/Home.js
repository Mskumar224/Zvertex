import React from 'react';

const Home = () => (
  <div style={{ 
    maxWidth: '800px', 
    margin: '40px auto', 
    padding: '20px', 
    textAlign: 'center'
  }}>
    <h2 style={{ color: '#333' }}>Welcome to ZvertexAI</h2>
    <p style={{ color: '#555', lineHeight: '1.6' }}>
      Your AI-powered job application platform. Find and apply to jobs seamlessly with our automated tools.
    </p>
    <a 
      href="/register" 
      style={{ 
        display: 'inline-block', 
        padding: '10px 20px', 
        background: '#007bff', 
        color: '#fff', 
        textDecoration: 'none', 
        borderRadius: '4px', 
        marginTop: '20px' 
      }}
    >
      Get Started
    </a>
  </div>
);

export default Home;