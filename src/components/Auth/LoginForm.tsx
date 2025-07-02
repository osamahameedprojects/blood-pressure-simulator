import React from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/scenarios');
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" fontWeight={600} mb={2} align="center">
          Welcome, Sara
        </Typography>
        <Typography variant="subtitle1" mb={3} align="center" color="text.secondary">
          Blood Pressure Training Simulator
        </Typography>
        <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleSubmit}>
          <TextField label="Email" type="email" variant="outlined" required fullWidth />
          <TextField label="Password" type="password" variant="outlined" required fullWidth />
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm; 