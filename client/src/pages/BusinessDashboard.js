import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';

function BusinessDashboard() {
  const [keywords, setKeywords] = useState([]);
  const history = useHistory();

  return (
    <Container sx={{ py: 5 }} className="zgpt-container">
      <div className="card">
        <Button
          onClick={() => history.push('/')}
          className="back-button"
          sx={{
            mb: 3,
            color: 'white',
            backgroundColor: '#00e676',
            '&:hover': { backgroundColor: '#00c853' },
          }}
        >
          Back
        </Button>
        <Typography variant="h4" gutterBottom>
          ZvertexAI Business Dashboard
        </Typography>
        <Typography sx={{ mb: 3 }}>Max 3 Resumes | 145 Submissions/Day</Typography>
        <ResumeUpload onResumeParsed={setKeywords} />
        {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={3} maxSubmissions={145} />}
        <JobTracker />
      </div>
    </Container>
  );
}

export default BusinessDashboard;