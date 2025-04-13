import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import exportToExcel from '../utils/exportToExcel'; // Changed to default import

function BusinessDashboard({ user, setSidebarOpen }) {
  const history = useHistory();
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    if (!user) {
      history.push('/login');
      return;
    }
    const fetchRecruiters = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/auth`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setRecruiters(res.data.profiles || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, [user, history]);

  const handleExport = () => {
    const exportData = recruiters.flatMap((recruiter) =>
      recruiter.appliedJobs.map((job) => ({
        RecruiterID: recruiter.id,
        JobID: job.jobId,
        JobTitle: job.jobTitle,
        Company: job.company,
        Technology: job.technology,
        JobLink: job.jobLink,
        DateApplied: new Date(job.date).toLocaleDateString(),
      }))
    );
    exportToExcel(exportData, 'Business_Job_Applications');
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={() => history.push('/')}
            sx={{ color: 'white', mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{ color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          Business Dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={handleExport}
          sx={{
            mb: 4,
            backgroundColor: '#ff6d00',
            '&:hover': { backgroundColor: '#e65100' },
          }}
        >
          Export to Excel
        </Button>
        {recruiters.length === 0 ? (
          <Typography>No recruiters found.</Typography>
        ) : (
          recruiters.map((recruiter) => (
            <Paper key={recruiter.id} sx={{ p: 3, mb: 4, backgroundColor: '#1e1e1e' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recruiter ID: {recruiter.id}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white' }}>Job ID</TableCell>
                    <TableCell sx={{ color: 'white' }}>Job Title</TableCell>
                    <TableCell sx={{ color: 'white' }}>Company</TableCell>
                    <TableCell sx={{ color: 'white' }}>Technology</TableCell>
                    <TableCell sx={{ color: 'white' }}>Job Link</TableCell>
                    <TableCell sx={{ color: 'white' }}>Date Applied</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recruiter.appliedJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ color: 'white' }}>
                        No jobs applied.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recruiter.appliedJobs.map((job) => (
                      <TableRow key={job.jobId}>
                        <TableCell sx={{ color: 'white' }}>{job.jobId}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{job.jobTitle}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{job.company}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{job.technology}</TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <a href={job.jobLink} target="_blank" rel="noopener noreferrer" style={{ color: '#00e676' }}>
                            Link
                          </a>
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {new Date(job.date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Paper>
          ))
        )}
      </Container>
    </Box>
  );
}

export default BusinessDashboard;