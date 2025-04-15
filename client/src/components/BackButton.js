import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = () => {
  const history = useHistory();

  return (
    <IconButton onClick={() => history.goBack()} sx={{ color: 'white' }}>
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackButton;