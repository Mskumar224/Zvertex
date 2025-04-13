import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [formData, setFormData] = useState({
    location: '',
    technologies: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { location, technologies } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!location || !technologies) {
      setError('Location and technologies are required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/profile`,
        { location, technologies: technologies.split(',').map((t) => t.trim()) },
        { headers: { 'x-auth-token': token } }
      );
      alert('Profile updated');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Update failed');
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
      <h2 style={{ textAlign: 'center', color: '#333' }}>Update Profile</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Location</label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={onChange}
            placeholder="e.g., New York, NY"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Technologies (comma-separated)</label>
          <input
            type="text"
            name="technologies"
            value={technologies}
            onChange={onChange}
            placeholder="e.g., JavaScript, Python"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }}
          />
        </div>
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
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;