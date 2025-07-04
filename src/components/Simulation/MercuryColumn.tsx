import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface MercuryColumnProps {
  value: number; // mmHg
}

const MAX_HEIGHT = 160; // px, for 200 mmHg

const MercuryColumn: React.FC<MercuryColumnProps> = ({ value }) => {
  const height = Math.max(0, Math.min(value, 200)) / 200 * MAX_HEIGHT;
  const intensityColor = value > 150 ? '#ff0080' : value > 100 ? '#00ff80' : '#00ffff';

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minWidth={90}>
      <Typography 
        variant="body2" 
        mb={1}
        sx={{ 
          color: '#00ffff', 
          fontFamily: '"Orbitron", monospace',
          fontWeight: 600,
          letterSpacing: '1px',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
          fontSize: '0.9rem',
        }}
      >
        PRESSURE
      </Typography>
      
      <Box sx={{ position: 'relative', mb: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            width: 50, 
            height: MAX_HEIGHT + 16, 
            background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 100%)',
            border: '2px solid rgba(0, 255, 255, 0.4)',
            borderRadius: '25px',
            position: 'relative', 
            overflow: 'hidden',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3), inset 0 0 15px rgba(0, 0, 0, 0.5)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '4px',
              left: '4px',
              right: '4px',
              bottom: '4px',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              borderRadius: '20px',
            },
          }}
        >
          {/* Pressure Scale Markers */}
          {[0, 50, 100, 150, 200].map((mark) => (
            <Box
              key={mark}
              sx={{
                position: 'absolute',
                right: '-6px',
                bottom: `${(mark / 200) * MAX_HEIGHT + 8}px`,
                width: '4px',
                height: '1px',
                backgroundColor: '#00ffff',
                opacity: 0.6,
              }}
            />
          ))}
          
          <motion.div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              width: 'calc(100% - 16px)',
              background: `linear-gradient(180deg, ${intensityColor} 0%, rgba(0, 255, 255, 0.8) 50%, rgba(0, 255, 255, 0.3) 100%)`,
              borderRadius: '16px',
              boxShadow: `0 0 15px ${intensityColor}, inset 0 0 8px rgba(255, 255, 255, 0.2)`,
              border: `1px solid ${intensityColor}`,
            }}
            animate={{ height: height + 'px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
          
          {/* Scanning line effect */}
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
              opacity: 0.8,
            }}
            animate={{ 
              bottom: height + 6 + 'px',
              opacity: [0.3, 1, 0.3],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </Paper>
        
        {/* Scale labels */}
        {[0, 50, 100, 150, 200].map((mark) => (
          <Typography
            key={mark}
            variant="caption"
            sx={{
              position: 'absolute',
              right: '-20px',
              bottom: `${(mark / 200) * MAX_HEIGHT + 3}px`,
              color: '#00ffff',
              fontFamily: '"Roboto Mono", monospace',
              fontSize: '8px',
              opacity: 0.7,
            }}
          >
            {mark}
          </Typography>
        ))}
      </Box>
      
      <Box
        sx={{
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a2e)',
          border: '2px solid rgba(0, 255, 255, 0.4)',
          borderRadius: '12px',
          padding: '6px 12px',
          minWidth: '70px',
          textAlign: 'center',
          boxShadow: '0 0 12px rgba(0, 255, 255, 0.3)',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: intensityColor,
            fontFamily: '"Orbitron", monospace',
            fontWeight: 700,
            textShadow: `0 0 12px ${intensityColor}`,
            filter: `drop-shadow(0 0 8px ${intensityColor})`,
            fontSize: '1.3rem',
          }}
        >
          {value}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(0, 255, 255, 0.7)',
            fontFamily: '"Roboto Mono", monospace',
            letterSpacing: '0.5px',
            fontSize: '0.7rem',
          }}
        >
          mmHg
        </Typography>
      </Box>
    </Box>
  );
};

export default MercuryColumn; 