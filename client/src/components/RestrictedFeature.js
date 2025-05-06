import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';

function RestrictedFeature() {
  const [open, setOpen] = useState(true); // Trigger popup when component mounts
  const history = useHistory();

  const handleClose = () => {
    setOpen(false);
    history.push('/');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Feature Access</DialogTitle>
      <DialogContent>
        <Typography>
          Subscribe for more features! Please sign up or log in to access this functionality.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => history.push('/signup')} color="primary">
          Sign Up
        </Button>
        <Button onClick={() => history.push('/login')} color="primary">
          Login
        </Button>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RestrictedFeature;