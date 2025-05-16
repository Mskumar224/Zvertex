import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function InterviewFAQs() {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => history.goBack()} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Interview FAQs
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Prepare for Success
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
          Common questions and answers to ace your tech interviews.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Technical Questions</Typography>
                <Typography variant="body2">
                  Tips for coding interviews and system design.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Behavioral Questions</Typography>
                <Typography variant="body2">
                  Strategies to showcase your soft skills and experience.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default InterviewFAQs;