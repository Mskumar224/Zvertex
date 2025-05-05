import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';

function StudentDashboard() {
  const [keywords, setKeywords] = useState([]);
  const history = useHistory();

  return (
    <Container sx={{ py: 5 }} className="zgpt-container">
      <div className="card">
        <Button
          onClick={() => history.push('/')}
          className="back-button"
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>
        <Typography variant="h4" gutterBottom>
          ZvertexAI Student Dashboard
        </Typography>
        <Typography sx={{ mb: 3 }}>Max 1 Resume | 45 Submissions/Day</Typography>
        <ResumeUpload onResumeParsed={setKeywords} />
        {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={1} maxSubmissions={45} />}
        <JobTracker />
      </div>
    </Container>
  );
}

export default StudentDashboard;