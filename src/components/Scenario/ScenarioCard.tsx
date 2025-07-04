import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

interface ScenarioCardProps {
  name: string;
  available: boolean;
  onClick?: () => void;
  selected?: boolean;
  completed?: boolean;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ name, available, onClick, selected, completed }) => {
  return (
    <motion.div
      whileHover={available ? { scale: 1.04, boxShadow: '0 6px 24px rgba(58,124,165,0.10)' } : {}}
      style={{ width: 200, margin: 12, borderRadius: 18, cursor: available ? 'pointer' : 'not-allowed' }}
    >
      <Paper
        elevation={selected ? 8 : 3}
        onClick={available ? onClick : undefined}
        sx={{
          opacity: available ? 1 : 0.6,
          borderRadius: 3,
          border: selected ? '2.5px solid #3A7CA5' : '2.5px solid transparent',
          minHeight: 140,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'border 0.2s',
          bgcolor: available ? 'background.paper' : '#f5f7fa',
        }}
      >
        <Typography variant="h6" align="center" fontWeight={600} sx={{ mb: 1 }}>
          {name}
        </Typography>
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          {!available ? (
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <LockIcon color="action" fontSize="medium" />
            </motion.div>
          ) : completed ? (
            <CheckCircleIcon color="success" fontSize="medium" />
          ) : (
            <PlayCircleFilledWhiteIcon color="primary" fontSize="medium" />
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ScenarioCard; 