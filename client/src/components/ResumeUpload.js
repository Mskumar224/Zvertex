import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onFileChange = (e) => setFile(e.target.files[0]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/upload-resume`,
        formData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Resume uploaded successfully');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Upload failed');
      console.error(err);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
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
      <h2 style={{ textAlign: 'center', color: '#333' }}>Upload Resume</h2>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          onChange={onFileChange}
          accept=".pdf"
          style={{ 
            marginBottom: '15px', 
            display: 'block', 
            width: '100%' 
          }}
        />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '10px', 
            background: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default ResumeUpload;