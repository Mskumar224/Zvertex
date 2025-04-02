import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const history = useHistory();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axios.post(`${apiUrl}/api/auth/upload-resume`, formData, {
        headers: { 
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        },
      });
      alert('Resume uploaded successfully!');
      history.push('/dashboard');
    } catch (err) {
      alert(err.response?.data.msg || 'Upload failed');
    }
  };

  return (
    <div>
      <div className="header">
        <h1>ZvertexAGI</h1>
        <div className="nav-links">
          <a href="/dashboard">Back to Dashboard</a>
        </div>
      </div>
      <div className="hero">
        <Typography variant="h2">Upload Resume</Typography>
        <Typography variant="body1">Add your resume to apply for jobs</Typography>
      </div>
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ margin: '20px 0' }}
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Upload
          </Button>
        </form>
      </div>
    </div>
  );
}

export default DocumentUpload;