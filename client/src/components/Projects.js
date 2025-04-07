import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, Card, CardContent, AppBar, Toolbar, CircularProgress } from '@mui/material';
import { useHistory } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

function Projects() {
  const history = useHistory();
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [cloudResult, setCloudResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'https://zvertexai-orzv.onrender.com';

  useEffect(() => {
    if (image) {
      handleTensorFlowAnalysis();
    }
  }, [image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    handleCloudAnalysis(file);
  };

  const handleTensorFlowAnalysis = async () => {
    setLoading(true);
    try {
      const model = await mobilenet.load();
      const imgElement = document.getElementById('projectImg');
      const preds = await model.classify(imgElement);
      setPredictions(preds);
    } catch (err) {
      console.error('TensorFlow Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloudAnalysis = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${apiUrl}/api/jobs/vision`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setCloudResult(data.labels || []);
    } catch (err) {
      console.error('Cloud Vision Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a44 0%, #2e4b7a 100%)', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(26, 42, 68, 0.9)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold' }} onClick={() => history.push('/')}>
            ZvertexAI
          </Typography>
          <Button color="inherit" onClick={() => history.push('/')}>Home</Button>
          <Button color="inherit" onClick={() => history.push('/zgpt')}>Zgpt</Button>
          <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 6 }}>
        <Typography variant="h3" align="center" sx={{ mb: 4 }}>Our In-House Projects</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <CardContent>
                <Typography variant="h5">AI Image Recognition (TensorFlow.js)</Typography>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ margin: '20px 0' }} />
                {image && <img id="projectImg" src={image} alt="Uploaded" style={{ maxWidth: '100%' }} />}
                {loading && <CircularProgress />}
                {predictions.length > 0 && (
                  <Box>
                    <Typography variant="h6">Predictions:</Typography>
                    {predictions.map((pred, idx) => (
                      <Typography key={idx}>{pred.className}: {Math.round(pred.probability * 100)}%</Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <CardContent>
                <Typography variant="h5">Cloud Vision Analysis (Google Cloud)</Typography>
                {cloudResult.length > 0 && (
                  <Box>
                    <Typography variant="h6">Cloud Results:</Typography>
                    {cloudResult.map((label, idx) => (
                      <Typography key={idx}>{label.description}</Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Projects;