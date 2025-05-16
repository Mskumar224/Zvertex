import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ProjectCloud() {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => history.goBack()} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Cloud Projects
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Cloud Computing
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
          Build scalable cloud solutions for career services.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">AWS Integration</Typography>
                <Typography variant="body2">
                  Deploy job matching platforms on AWS.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Serverless</Typography>
                <Typography variant="body2">
                  Automate applications with Lambda.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProjectCloud;