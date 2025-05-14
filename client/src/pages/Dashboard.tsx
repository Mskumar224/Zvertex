import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in');
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const companies = JSON.parse(localStorage.getItem('selectedCompanies') || '[]');
        const [userRes, jobsRes] = await Promise.all([
          axios.post('https://zvertexai-orzv.onrender.com/api/select-companies', { token, companies }),
          axios.get('https://zvertexai-orzv.onrender.com/api/jobs', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const appliedToday = await axios.post('https c://zvertexai-orzv.onrender.com/api/auto-apply', { token });
        setUserData({
          email: decoded.email,
          companies,
          appliedToday: appliedToday.data.appliedToday || 0,
        });
        setJobs(jobsRes.data.jobs || []);
      } catch (error: any) {
        setError('Error fetching data: ' + (error.response?.data?.message || 'Server error'));
      }
    };
    fetchData();
  }, []);

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Dashboard</Typography>
      {error ? (
        <Typography sx={{ color: '#dc3545' }}>{error}</Typography>
      ) : userData ? (
        <>
          <Typography variant="h6">Welcome, {userData.email}</Typography>
          <Typography sx={{ mt: 2 }}>Selected Companies: {userData.companies.join(', ') || 'None'}</Typography>
          <Typography>Jobs Applied Today: {userData.appliedToday}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/scraper-preferences')}
            sx={{ mt: 2, mb: 2 }}
          >
            Manage Scraper Preferences
          </Button>
          <Typography sx={{ mt: 2, mb: 1 }}>Available Jobs:</Typography>
          <List>
            {jobs.map((job) => (
              <ListItem key={job.jobId}>
                <ListItemText
                  primary={`${job.title} at ${job.company} (${job.source})`}
                  secondary={`Posted: ${new Date(job.posted).toLocaleDateString()} | Location: ${job.location || 'N/A'}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
};

export default Dashboard;