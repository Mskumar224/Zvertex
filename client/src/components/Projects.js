import React from 'react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '40px auto', 
      padding: '20px', 
      borderRadius: '8px', 
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      background: '#fff'
    }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          marginBottom: '15px', 
          padding: '8px 16px', 
          background: '#6c757d', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Back
      </button>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Projects</h2>
      <p style={{ color: '#555', lineHeight: '1.6' }}>
        Explore our AI-powered projects designed to enhance your job search experience.
      </p>
    </div>
  );
};

export default Projects;