import React from 'react';
import { Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface BadgeAnimationProps {
  badgeName: string;
}

const BadgeAnimation: React.FC<BadgeAnimationProps> = ({ badgeName }) => {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}
    >
      <Paper elevation={6} sx={{ px: 4, py: 2, bgcolor: 'success.main', color: 'white', borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} align="center">
          🏅 {badgeName}
        </Typography>
        <Typography variant="body2" align="center">
          Badge Earned!
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default BadgeAnimation; 