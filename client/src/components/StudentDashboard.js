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
  TextField,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import exportToExcel from '../utils/exportToExcel'; // Changed to default import

function StudentDashboard({ user, setSidebarOpen }) {
  const history = useHistory();
  const [profile, setProfile] = useState({ technologies: [], companies: [], appliedJobs: [] });
  const [loading, setLoading] = useState(true);
  const [technologies, setTechnologies] = useState('');
  const [companies, setCompanies] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    if (!user) {
      history.push('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/auth`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setProfile({
          technologies: res.data.technologies || [],
          companies: res.data.companies || [],
          appliedJobs: res.data.appliedJobs || [],
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, history]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        technologies: technologies.split(',').map((t) => t.trim()),
        companies: companies.split(',').map((c) => c.trim()),
      };
      await axios.put(
        `${apiUrl}/api/auth/profile`,
        updatedProfile,
        {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        }
      );
      setProfile((prev) => ({ ...prev, ...updatedProfile }));
      setTechnologies('');
      setCompanies('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    const exportData = profile.appliedJobs.map((job) => ({
      JobID: job.jobId,
      JobTitle: job.jobTitle,
      Company: job.company,
      Technology: job.technology,
      JobLink: job.jobLink,
      DateApplied: new Date(job.date).toLocaleDateString(),
    }));
    exportToExcel(exportData, 'Student_Job_Applications');
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
          Student Dashboard
        </Typography>
        <Box component="form" onSubmit={handleUpdateProfile} sx={{ mb: 4 }}>
          <TextField
            label="Technologies (comma-separated)"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
            sx={{ mr: 2, mb: 2, backgroundColor: '#263238', color: 'white' }}
            InputLabelProps={{ style: { color: '#b0bec5' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <TextField
            label="Companies (comma-separated)"
            value={companies}
            onChange={(e) => setCompanies(e.target.value)}
            sx={{ mr: 2, mb: 2, backgroundColor: '#263238', color: 'white' }}
            InputLabelProps={{ style: { color: '#b0bec5' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#ff6d00',
              '&:hover': { backgroundColor: '#e65100' },
            }}
          >
            Update Profile
          </Button>
        </Box>
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
        <Paper sx={{ p: 3, backgroundColor: '#1e1e1e' }}>
          <Typography sx={{ mb: 2 }}>
            Technologies:{' '}
            {profile.technologies.map((tech) => (
              <Chip key={tech} label={tech} sx={{ mr: 1, mb: 1, backgroundColor: '#ff6d00' }} />
            ))}
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Companies:{' '}
            {profile.companies.map((company) => (
              <Chip key={company} label={company} sx={{ mr: 1, mb: 1, backgroundColor: '#ff6d00' }} />
            ))}
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
              {profile.appliedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ color: 'white' }}>
                    No jobs applied.
                  </TableCell>
                </TableRow>
              ) : (
                profile.appliedJobs.map((job) => (
                  <TableRow key={job.jobId}>
                    <TableCell sx={{ color: 'white' }}>{job.jobId}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{job.jobTitle}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{job.company}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{job.technology}</TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      <a href={job.jobLink}                target="_blank" rel="noopener noreferrer" style={{ color: '#00e676' }}>
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
      </Container>
    </Box>
  );
}

export default StudentDashboard;