import React from 'react';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackButton() {
  const history = useHistory();

  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={() => history.goBack()}
      sx={{ mb: 2, color: '#1976d2', borderColor: '#1976d2' }}
    >
      Back
    </Button>
  );
}

export default BackButton;