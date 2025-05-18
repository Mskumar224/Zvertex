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
      sx={{ mb: 2, color: 'white', borderColor: 'white', '&:hover': { borderColor: '#ff6d00', color: '#ff6d00' } }}
    >
      Back
    </Button>
  );
}

export default BackButton;