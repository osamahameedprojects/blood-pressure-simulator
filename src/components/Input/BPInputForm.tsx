import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

interface BPInputFormProps {
  onSubmit: (systolic: number, diastolic: number) => void;
}

const BPInputForm: React.FC<BPInputFormProps> = ({ onSubmit }) => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!systolic || !diastolic) return;
    onSubmit(Number(systolic), Number(diastolic));
  };

  return (
    <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
      <Typography variant="h6" fontWeight={600} mb={2} align="center">
        Enter Blood Pressure
      </Typography>
      <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleSubmit}>
        <TextField
          label="Systolic (mmHg)"
          type="number"
          value={systolic}
          onChange={e => setSystolic(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Diastolic (mmHg)"
          type="number"
          value={diastolic}
          onChange={e => setDiastolic(e.target.value)}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default BPInputForm; 