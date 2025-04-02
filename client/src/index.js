import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './styles.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1a2a44' }, // Dark blue from DearJob.org
    secondary: { main: '#f28c38' }, // Orange accent
    background: { default: '#f5f6fa' }, // Light background
  },
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);