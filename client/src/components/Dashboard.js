import React, { useState, useEffect } from 'react';
import { Typography, Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Dashboard({ user, setUser }) {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', description: '' });
  const [filter, setFilter] = useState('');
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const jobsRes = await axios.get('/api/jobs');
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);

        const appliedRes = await axios.get('/api/jobs/applied', {
          headers: { 'x-auth-token': token },
        });
        setAppliedJobs(Array.isArray(appliedRes.data) ? appliedRes.data : []);
      } catch (err) {
        console.error('Fetch Error:', err);
        if (err.response?.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          history.push('/');
        } else {
          alert('Error loading data: ' + (err.response?.data.msg || 'Server error'));
          setJobs([]);
          setAppliedJobs([]);
        }
      }
    };
    fetchData();
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/');
  };

  const handleAutoApply = async () => {
    try {
      const res = await axios.post('/api/jobs/auto-apply', {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      alert(res.data.msg);
      setAppliedJobs([...appliedJobs, ...jobs]);
    } catch (err) {
      alert(err.response?.data.msg || 'Auto-apply failed');
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/jobs/post', newJob, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setJobs([...jobs, res.data]);
      setNewJob({ title: '', company: '', location: '', description: '' });
      alert('Job posted successfully!');
    } catch (err) {
      alert(err.response?.data.msg || 'Job posting failed');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (!job || !job.title || !job.company) return false;
    const filterLower = filter.toLowerCase();
    return (
      job.title.toLowerCase().includes(filterLower) ||
      job.company.toLowerCase().includes(filterLower)
    );
  });

  return (
    <div>
      <div className="header">
        <h1>ZvertexAGI</h1>
        <div className="nav-links">
          <a href="#" onClick={handleLogout}>Logout</a>
        </div>
      </div>
      <div className="hero">
        <Typography variant="h2">{user?.subscriptionType} Dashboard</Typography>
        <Typography variant="body1">Manage your job applications or postings</Typography>
      </div>
      <div style={{ padding: '40px' }}>
        {user?.subscriptionType === 'STUDENT' && (
          <div className="card">
            <Button variant="contained" color="secondary" onClick={() => history.push('/upload')}>
              Upload Resume
            </Button>
            <Button variant="contained" color="secondary" onClick={handleAutoApply} sx={{ ml: 2 }}>
              Auto-Apply to All Jobs
            </Button>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Applied Jobs ({appliedJobs.length})
            </Typography>
            <Grid container spacing={2}>
              {appliedJobs.map(job => (
                <Grid item xs={12} sm={6} key={job._id}>
                  <div className="card">
                    <Typography variant="h6">{job.jobId}</Typography>
                    <Typography>Applied on: {new Date(job.date).toLocaleDateString()}</Typography>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        {(user?.subscriptionType === 'RECRUITER' || user?.subscriptionType === 'BUSINESS') && (
          <div className="card">
            <Typography variant="h6">Post a Job</Typography>
            <form onSubmit={handlePostJob}>
              <TextField
                label="Job Title"
                fullWidth
                margin="normal"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              />
              <TextField
                label="Company"
                fullWidth
                margin="normal"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              />
              <TextField
                label="Location"
                fullWidth
                margin="normal"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              />
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              />
              <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                Post Job
              </Button>
            </form>
          </div>
        )}

        <div className="card">
          <Typography variant="h6">Available Jobs</Typography>
          <TextField
            label="Search Jobs"
            fullWidth
            margin="normal"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Grid container spacing={2}>
            {filteredJobs.map(job => (
              <Grid item xs={12} sm={6} key={job._id}>
                <div className="card">
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography>{job.company} - {job.location}</Typography>
                  <Typography>{job.description}</Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;