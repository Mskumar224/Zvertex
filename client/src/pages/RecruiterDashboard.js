import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';

function RecruiterDashboard() {
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
          ZvertexAI Recruiter Dashboard
        </Typography>
        <Typography sx={{ mb: 3 }}>Max 5 Resumes | 45 Submissions/Day</Typography>
        <ResumeUpload onResumeParsed={setKeywords} />
        {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={5} maxSubmissions={45} />}
        <JobTracker />
      </div>
    </Container>
  );
}

export default RecruiterDashboard;