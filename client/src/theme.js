import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00e676', // Accent color for buttons and links
    },
    secondary: {
      main: '#1a2a44', // Background color
    },
    text: {
      primary: '#FFFFFF', // Text color
    },
    background: {
      default: '#1a2a44', // Default background
      paper: '#FFFFFF', // Card backgrounds
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
});

export default theme;