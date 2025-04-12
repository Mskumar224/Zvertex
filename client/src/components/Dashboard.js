import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx';

function Dashboard({ user, setUser }) {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    if (!user) {
      history.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch jobs
        const jobsRes = await axios.get(`${apiUrl}/api/job`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setJobs(jobsRes.data || []); // Default to empty array if undefined

        // Fetch applied jobs
        const appliedRes = await axios.get(`${apiUrl}/api/job/applied`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setAppliedJobs(appliedRes.data || []); // Default to empty array if undefined
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to fetch data');
        setJobs([]);
        setAppliedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, history, apiUrl]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/job?search=${search}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setJobs(res.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Search failed');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    try {
      await axios.post(
        `${apiUrl}/api/job/apply`,
        { jobId: job.jobId, technology: search, jobTitle: job.title, company: job.company },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setAppliedJobs([...appliedJobs, { jobId: job.jobId, technology: search, jobTitle: job.title, company: job.company, appliedAt: new Date() }]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Application failed');
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(appliedJobs.map(job => ({
      JobID: job.jobId,
      Title: job.jobTitle,
      Company: job.company,
      Technology: job.technology,
      AppliedAt: new Date(job.appliedAt).toLocaleDateString(),
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applied Jobs');
    XLSX.writeFile(workbook, 'applied_jobs.xlsx');
  };

  if (!user) return null;

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)',
      color: 'white',
      py: 8,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#00e676' }}>
              Welcome, {user.email}! Search for jobs or view your applications below.
            </Typography>
          </Box>

          {/* Search Form */}
          <Box component="form" onSubmit={handleSearch} sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            p: 3,
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <TextField
              placeholder="Search jobs (e.g., Python, React)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: 1,
                minWidth: '200px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ff6d00' },
                  '&:hover fieldset': { borderColor: '#e65100' },
                  '&.Mui-focused fieldset': { borderColor: '#00e676' },
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#ff6d00',
                '&:hover': { backgroundColor: '#e65100' },
                borderRadius: '25px',
                py: 1.5,
                px: 4,
                fontWeight: 'bold',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
            </Button>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ borderRadius: '10px' }}>
              {error}
            </Alert>
          )}

          {/* Job Results */}
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            p: 3,
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#ff6d00' }}>
              Job Results
            </Typography>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress color="inherit" />
              </Box>
            ) : jobs.length > 0 ? (
              <Table sx={{ backgroundColor: 'transparent', color: 'white' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#00e676', fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ color: '#00e676', fontWeight: 'bold' }}>Company</TableCell>
                    <TableCell sx={{ color: '#00e676', fontWeight: 'bold' }}>Location</TableCell>
                    <TableCell sx={{ color: '#00e676', fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.jobId}>
                      <TableCell sx={{ color: 'white' }}>{job.title || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'white' }}>{job.company || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'white' }}>{job.location || 'N/A'}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleApply(job)}
                          disabled={appliedJobs.some((applied) => applied.jobId === job.jobId)}
                          sx={{
                            backgroundColor: '#ff6d00',
                            '&:hover': { backgroundColor: '#e65100' },
                            borderRadius: '25px',
                            py: 1,
                            px: 3,
                          }}
                        >
                          {appliedJobs.some((applied) => applied.jobId === job.jobId) ? 'Applied' : 'Apply'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography sx={{ color: 'white', textAlign: 'center', py: 4 }}>
                No jobs found. Try a different search term.
              </Typography>
            )}
          </Box>

          {/* Applied Jobs */}
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            p: 3,
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff6d00' }}>
                Applied Jobs
              </Typography>
              <Button
                variant="outlined"
                onClick={exportToExcel}
                disabled={appliedJobs.length === 0}
                sx={{
                  color: '#00e676',
                  borderColor: '#00e676',
                  borderRadius: '25px',
                  py: 1,
                  px: 3,
                  '&:hover': { borderColor: '#00c853', backgroundColor: 'rgba(0,230,118,0.1)' },
                }}
              >
                Export to Excel
              </Button>
            </Box>
            {appliedJobs.length > 0 ? (
              <Table sx={{ backgroundColor: 'transparent', color: 'white' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#00e676', fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ color: '#00e676', fontWeight: 'bold' }}>Company</TableCell>
                    <TableCell sx={{ color: '#00e676', fontWeight: 'bold' }}>Technology</TableCell>
                    <TableCell sx={{ color: '#00e676', fontWeight: 'bold' }}>Applied On</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appliedJobs.map((job) => (
                    <TableRow key={job.jobId}>
                      <TableCell sx={{ color: 'white' }}>{job.jobTitle || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'white' }}>{job.company || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'white' }}>{job.technology || 'N/A'}</TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {new Date(job.appliedAt).toLocaleDateString() || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography sx={{ color: 'white', textAlign: 'center', py: 4 }}>
                No jobs applied yet.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Dashboard;