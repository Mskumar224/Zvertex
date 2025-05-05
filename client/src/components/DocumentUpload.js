import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';

function DocumentUpload({ job, onClose }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('jobId', job.id);

    await axios.post(`${process.env.REACT_APP_API_URL}/api/job/apply-with-docs`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' },
    });
    alert('Application submitted with documents!');
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="zgpt-container">
      <DialogTitle>Upload Additional Documents for {job.title}</DialogTitle>
      <DialogContent className="card">
        <Typography>Upload required documents or apply manually:</Typography>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: '16px' }} />
        <Typography sx={{ mt: 2 }}>
          Alternatively, <a href={job.link} target="_blank" rel="noopener noreferrer">apply manually here</a>.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file}
          className="back-button"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DocumentUpload;