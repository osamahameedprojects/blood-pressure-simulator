import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#3A7CA5', light: '#E3F2FD' },
    background: { default: '#F5F7FA', paper: '#FFFFFF' },
    success: { main: '#43A047' },
    error: { main: '#E53935' },
    text: { primary: '#222', secondary: '#555' },
  },
  typography: {
    fontFamily: ['Inter', 'Open Sans', 'Arial', 'sans-serif'].join(','),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme; 