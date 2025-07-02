import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface FeedbackPanelProps {
  trueSystolic: number;
  trueDiastolic: number;
  enteredSystolic: number;
  enteredDiastolic: number;
}

const getError = (trueVal: number, enteredVal: number) => Math.abs(trueVal - enteredVal);

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ trueSystolic, trueDiastolic, enteredSystolic, enteredDiastolic }) => {
  const sysError = getError(trueSystolic, enteredSystolic);
  const diaError = getError(trueDiastolic, enteredDiastolic);
  const sysColor = sysError <= 5 ? 'success.main' : 'error.main';
  const diaColor = diaError <= 5 ? 'success.main' : 'error.main';

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3, minWidth: 320 }}>
      <Typography variant="subtitle1" mb={1} align="center">Feedback</Typography>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography color="text.secondary">True Systolic:</Typography>
        <Typography color="primary.main">{trueSystolic}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography color="text.secondary">Your Systolic:</Typography>
        <Typography color={sysColor}>{enteredSystolic} ({sysError} mmHg)</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography color="text.secondary">True Diastolic:</Typography>
        <Typography color="primary.main">{trueDiastolic}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography color="text.secondary">Your Diastolic:</Typography>
        <Typography color={diaColor}>{enteredDiastolic} ({diaError} mmHg)</Typography>
      </Box>
    </Paper>
  );
};

export default FeedbackPanel; 