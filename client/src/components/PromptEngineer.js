import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function PromptEngineer() {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => history.goBack()} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: 'white', flexGrow: 1, textAlign: 'center' }}>
            Zoho Prompt Engineering
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Craft Intelligent AI Responses
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
          Powered by Zoho, our prompt engineering ensures precise and effective AI interactions for job matching and career advice.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Optimized Prompts</Typography>
                <Typography variant="body2">
                  Design prompts for Llama 3.1 to deliver accurate career guidance in Telugu.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '15px' }}>
              <CardContent>
                <Typography variant="h6">Agenetic AI</Typography>
                <Typography variant="body2">
                  Leverage prompt engineering for intelligent job matching agents.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PromptEngineer;