import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackButton() {
  const history = useHistory();

  return (
    <Tooltip title="Go Back">
      <IconButton
        onClick={() => history.goBack()}
        sx={{
          color: 'white',
          backgroundColor: '#ff6d00',
          '&:hover': { backgroundColor: '#e65100' },
          borderRadius: '50%',
          p: 1,
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
}

export default BackButton;