import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ py: 3, mt: 'auto', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        © 2025 ZvertexAGI. All rights reserved.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Contact: Zvertex.247@gmail.com
      </Typography>
    </Box>
  );
}

export default Footer;