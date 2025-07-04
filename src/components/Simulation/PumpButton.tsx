import React from 'react';
import { Button } from '@mui/material';

interface PumpButtonProps {
  onPump: () => void;
}

const PumpButton: React.FC<PumpButtonProps> = ({ onPump }) => {
  return (
    <Button
      variant="contained"
      size="large"
      onClick={onPump}
      sx={{ 
        mt: 2, 
        px: 6, 
        py: 2,
        fontSize: '1.1rem',
        fontWeight: 700,
        fontFamily: '"Orbitron", monospace',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        border: '3px solid rgba(0, 255, 255, 0.5)',
        borderRadius: '20px',
        color: '#00ffff',
        textShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
          transition: 'left 0.5s ease',
        },
        '&:hover': {
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%)',
          border: '3px solid rgba(0, 255, 255, 0.8)',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(0, 255, 255, 0.2)',
          transform: 'translateY(-2px)',
          color: '#ffffff',
          textShadow: '0 0 20px rgba(0, 255, 255, 1)',
          '&::before': {
            left: '100%',
          },
        },
        '&:active': {
          transform: 'translateY(0px)',
          boxShadow: '0 0 50px rgba(0, 255, 255, 0.8), inset 0 0 40px rgba(0, 255, 255, 0.3)',
          background: 'linear-gradient(145deg, #16213e 0%, #0f0f1e 50%, #1a1a2e 100%)',
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <span style={{ position: 'relative', zIndex: 2 }}>
INFLATE BULB
      </span>
    </Button>
  );
};

export default PumpButton; 