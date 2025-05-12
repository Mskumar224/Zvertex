import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';
import { useHistory } from 'react-router-dom';

function BusinessDashboard() {
  const [keywords, setKeywords] = useState([]);
  const history = useHistory();

  return (
    <Container sx={{ py: 5 }}>
      <Button
        variant="outlined"
        onClick={() => history.goBack()}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>Business Dashboard</Typography>
      <ResumeUpload onResumeParsed={setKeywords} />
      {keywords.length > 0 && <JobApply keywords={keywords} />}
      <JobTracker />
    </Container>
  );
}

export default BusinessDashboard;