import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface JobApplication {
  jobTitle: string;
  company: string;
  location: string;
  dateApplied: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (!decoded || typeof decoded !== 'object' || !decoded.isOtpVerified) {
          throw new Error('Invalid token payload or unverified account');
        }

        // Fetch user profile
        const profileRes = await axios.get('https://zvertexai-orzv.onrender.com/api/update-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch job applications
        const jobsRes = await axios.get('https://zvertexai-orzv.onrender.com/api/job-applications', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData({
          email: decoded.email,
          subscription: profileRes.data.user.subscription,
          phone: profileRes.data.user.phone,
          companies: JSON.parse(localStorage.getItem('selectedCompanies') || '[]'),
          resumeUploaded: localStorage.getItem('resumeUploaded') === 'true',
        });
        setJobApplications(jobsRes.data.applications || []);
      } catch (error: any) {
        console.error('Fetch data failed:', error.message, error.response?.status);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setMessage('Unauthorized: Please log in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        } else if (error.response?.status === 404) {
          setMessage('Data endpoint not found. Please check the server.');
        } else if (error.response?.status === 400) {
          setMessage(`Data fetch failed: ${error.response.data.message}`);
        } else {
          setMessage('Failed to load dashboard data. Please try again later.');
        }
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <Container className="glass-card" sx={{ mt: 5, py: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>Dashboard</Typography>
      {userData ? (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>User Details</Typography>
          <Typography>Email: {userData.email}</Typography>
          <Typography>Subscription: {userData.subscription}</Typography>
          <Typography>Phone: {userData.phone}</Typography>
          <Typography>Selected Companies: {userData.companies.join(', ') || 'None'}</Typography>
          <Typography>Resume Uploaded: {userData.resumeUploaded ? 'Yes' : 'No'}</Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Job Applications</Typography>
          {jobApplications.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job Title</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Date Applied</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobApplications.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell>{job.jobTitle}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{new Date(job.dateApplied).toLocaleDateString()}</TableCell>
                      <TableCell>{job.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No job applications yet.</Typography>
          )}

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/resume-upload')}
              sx={{ mr: 2, px: 4, py: 1.5 }}
            >
              Update Resume
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/companies')}
              sx={{ mr: 2, px: 4, py: 1.5 }}
            >
              Update Companies
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/confirm-auto-apply')}
              sx={{ px: 4, py: 1.5 }}
            >
              Configure Auto-Apply
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography>Loading your data...</Typography>
      )}
      {message && (
        <Typography sx={{ mt: 2, color: message.includes('failed') || message.includes('Unauthorized') ? '#dc3545' : '#28a745' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Dashboard;