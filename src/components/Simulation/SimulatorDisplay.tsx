import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import MercuryColumn from './MercuryColumn';

interface SimulatorDisplayProps {
  value: number;
}

const SimulatorDisplay: React.FC<SimulatorDisplayProps> = ({ value }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={4}>
      {/* Virtual Arm/Gauge Placeholder */}
      <Paper elevation={2} sx={{ width: 180, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#e3f2fd' }}>
        <Typography variant="body1" color="text.secondary">Virtual Arm/Gauge</Typography>
      </Paper>
      {/* Mercury Column */}
      <MercuryColumn value={value} />
    </Box>
  );
};

export default SimulatorDisplay; 