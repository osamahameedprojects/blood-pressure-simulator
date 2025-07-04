import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import MercuryColumn from './MercuryColumn';

interface SimulatorDisplayProps {
  value: number;
  isPulsing: boolean;
}

const SimulatorDisplay: React.FC<SimulatorDisplayProps> = ({ value, isPulsing }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={3} mb={2}>
      {/* Futuristic Virtual Arm/Gauge */}
      <Paper 
        elevation={0} 
        sx={{ 
          width: 180, 
          height: 200, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%)',
          border: '2px solid rgba(0, 255, 255, 0.4)',
          borderRadius: '15px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            bottom: '10px',
            border: '1px solid rgba(0, 255, 255, 0.2)',
            borderRadius: '10px',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent)',
            animation: 'hologramSweep 4s ease-in-out infinite',
          },
          '@keyframes hologramSweep': {
            '0%': { left: '-100%' },
            '50%': { left: '100%' },
            '100%': { left: '-100%' },
          },
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#00ffff', 
            fontFamily: '"Orbitron", monospace',
            fontWeight: 600,
            textAlign: 'center',
            mb: 2,
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
            letterSpacing: '1px',
          }}
        >
PATIENT ARM
        </Typography>
                 <motion.div
           style={{
             width: '60px',
             height: '60px',
             border: '3px solid #00ffff',
             borderRadius: '50%',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             background: 'radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, transparent 70%)',
             boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
             marginBottom: '16px',
           }}
           animate={isPulsing ? {
             scale: [1, 1.2, 1],
             boxShadow: [
               '0 0 20px rgba(0, 255, 255, 0.5)',
               '0 0 40px rgba(255, 20, 147, 0.9)',
               '0 0 20px rgba(0, 255, 255, 0.5)'
             ],
           } : {
             scale: 1,
             boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
           }}
           transition={{
             duration: isPulsing ? 0.8 : 1,
             repeat: isPulsing ? Infinity : 0,
             ease: "easeInOut"
           }}
         >
           <motion.div
             animate={isPulsing ? {
               scale: [1, 1.3, 1],
               filter: [
                 'drop-shadow(0 0 5px rgba(255, 20, 147, 0.5))',
                 'drop-shadow(0 0 15px rgba(255, 20, 147, 1))',
                 'drop-shadow(0 0 5px rgba(255, 20, 147, 0.5))'
               ]
             } : {
               scale: 1,
               filter: 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.5))'
             }}
             transition={{
               duration: isPulsing ? 0.8 : 1,
               repeat: isPulsing ? Infinity : 0,
               ease: "easeInOut"
             }}
             style={{ 
               fontSize: '28px',
               fontWeight: 'bold'
             }}
           >
             🫀
           </motion.div>
         </motion.div>
                 <motion.div
           animate={isPulsing ? {
             opacity: [0.7, 1, 0.7],
             scale: [1, 1.05, 1],
           } : {
             opacity: 0.7,
             scale: 1,
           }}
           transition={{
             duration: isPulsing ? 0.8 : 1,
             repeat: isPulsing ? Infinity : 0,
             ease: "easeInOut"
           }}
         >
           <Typography 
             variant="caption" 
             sx={{ 
               color: isPulsing ? '#ff1493' : 'rgba(0, 255, 255, 0.7)', 
               fontFamily: '"Roboto Mono", monospace',
               textAlign: 'center',
               letterSpacing: '0.5px',
               fontWeight: isPulsing ? 700 : 400,
               textShadow: isPulsing ? '0 0 10px rgba(255, 20, 147, 0.8)' : 'none',
               fontSize: '11px',
               whiteSpace: 'nowrap',
             }}
           >
             {isPulsing ? 'PULSE DETECTED' : 'MONITORING'}
           </Typography>
         </motion.div>
      </Paper>
      
      {/* Mercury Column */}
      <MercuryColumn value={value} />
    </Box>
  );
};

export default SimulatorDisplay; 