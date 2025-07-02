import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface MercuryColumnProps {
  value: number; // mmHg
}

const MAX_HEIGHT = 200; // px, for 200 mmHg

const MercuryColumn: React.FC<MercuryColumnProps> = ({ value }) => {
  const height = Math.max(0, Math.min(value, 200)) / 200 * MAX_HEIGHT;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minWidth={80}>
      <Typography variant="body2" mb={1}>mmHg</Typography>
      <Paper elevation={3} sx={{ width: 40, height: MAX_HEIGHT + 8, bgcolor: '#f5f7fa', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'linear-gradient(180deg, #3A7CA5 60%, #E3F2FD 100%)',
            borderRadius: 8,
          }}
          animate={{ height }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </Paper>
      <Typography variant="h6" mt={1}>{value}</Typography>
    </Box>
  );
};

export default MercuryColumn; 