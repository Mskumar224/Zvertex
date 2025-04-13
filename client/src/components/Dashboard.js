import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/jobs/stats`,
          { headers: { 'x-auth-token': token } }
        );
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load stats');
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ 
      maxWidth: '600px', 
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
      <h2 style={{ textAlign: 'center', color: '#333' }}>Dashboard</h2>
      <h3 style={{ color: '#555' }}>Jobs Applied Per Day</h3>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {Object.entries(stats).length ? (
          Object.entries(stats).map(([date, count]) => (
            <li 
              key={date} 
              style={{ 
                padding: '10px', 
                borderBottom: '1px solid #ddd', 
                color: '#333' 
              }}
            >
              {date}: {count} job{count > 1 ? 's' : ''}
            </li>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#555' }}>No jobs applied yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;