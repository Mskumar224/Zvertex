import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

function AutoApplyForm({ open, onClose, job, onApply }) {
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${apiUrl}/api/jobs/apply`,
        { jobId: job._id },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setApplicationUrl(res.data.applicationUrl);
      onApply(res.data.applicationUrl);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to prepare application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Apply to {job.title}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.primary' }}>
            Upload your resume and optionally add a cover letter.
          </Typography>
          <TextField
            label="Cover Letter (Optional)"
            multiline
            rows={4}
            fullWidth
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            sx={{ mb: 3 }}
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            style={{ marginBottom: '16px' }}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {applicationUrl && (
            <Typography sx={{ mb: 2 }}>
              Application ready!{' '}
              <a href={applicationUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#ff6d00' }}>
                Click here to apply
              </a>
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !resume}
          onClick={handleSubmit}
          sx={{ backgroundColor: '#ff6d00', '&:hover': { backgroundColor: '#e65100' } }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AutoApplyForm;