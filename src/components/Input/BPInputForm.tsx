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
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        minWidth: 320,
        maxWidth: 350,
        background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        border: '1px solid rgba(0, 255, 255, 0.4)',
        borderRadius: '12px',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.15), inset 0 0 20px rgba(0, 255, 255, 0.05)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '6px',
          left: '6px',
          right: '6px',
          bottom: '6px',
          border: '1px solid rgba(0, 255, 255, 0.2)',
          borderRadius: '8px',
          pointerEvents: 'none',
        },
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight={700} 
        mb={2} 
        align="center"
        sx={{
          background: 'linear-gradient(45deg, #00ffff 0%, #0080ff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: '"Orbitron", monospace',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          textShadow: '0 0 15px rgba(0, 255, 255, 0.5)',
          filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))',
          fontSize: { xs: '1rem', md: '1.2rem' },
        }}
      >
Blood Pressure Reading
      </Typography>
      
      <Box component="form" display="flex" flexDirection="column" gap={2.5} onSubmit={handleSubmit}>
        <TextField
          label="Systolic (mmHg)"
          type="number"
          value={systolic}
          onChange={e => setSystolic(e.target.value)}
          required
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              background: 'linear-gradient(145deg, #0f0f1e 0%, #1a1a2e 100%)',
              borderRadius: '10px',
              '& fieldset': {
                borderColor: 'rgba(0, 255, 255, 0.3)',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 255, 255, 0.5)',
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00ffff',
                borderWidth: '2px',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
              },
              '& input': {
                color: '#00ffff',
                fontFamily: '"Roboto Mono", monospace',
                fontSize: '1.1rem',
                fontWeight: 500,
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(0, 255, 255, 0.7)',
              fontFamily: '"Roboto Mono", monospace',
              '&.Mui-focused': {
                color: '#00ffff',
              },
            },
          }}
        />
        
        <TextField
          label="Diastolic (mmHg)"
          type="number"
          value={diastolic}
          onChange={e => setDiastolic(e.target.value)}
          required
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              background: 'linear-gradient(145deg, #0f0f1e 0%, #1a1a2e 100%)',
              borderRadius: '10px',
              '& fieldset': {
                borderColor: 'rgba(0, 255, 255, 0.3)',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 255, 255, 0.5)',
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00ffff',
                borderWidth: '2px',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
              },
              '& input': {
                color: '#00ffff',
                fontFamily: '"Roboto Mono", monospace',
                fontSize: '1.1rem',
                fontWeight: 500,
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(0, 255, 255, 0.7)',
              fontFamily: '"Roboto Mono", monospace',
              '&.Mui-focused': {
                color: '#00ffff',
              },
            },
          }}
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          size="large" 
          sx={{ 
            mt: 1.5,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            fontFamily: '"Orbitron", monospace',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            border: '2px solid rgba(0, 255, 255, 0.5)',
            borderRadius: '12px',
            color: '#00ffff',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
            boxShadow: '0 0 25px rgba(0, 255, 255, 0.3), inset 0 0 15px rgba(0, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent)',
              transition: 'left 0.5s ease',
            },
            '&:hover': {
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f1e 100%)',
              border: '2px solid rgba(0, 255, 255, 0.8)',
              boxShadow: '0 0 35px rgba(0, 255, 255, 0.5), inset 0 0 25px rgba(0, 255, 255, 0.2)',
              transform: 'translateY(-1px)',
              color: '#ffffff',
              textShadow: '0 0 15px rgba(0, 255, 255, 1)',
              '&::before': {
                left: '100%',
              },
            },
            '&:active': {
              transform: 'translateY(0px)',
              boxShadow: '0 0 40px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(0, 255, 255, 0.3)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>
Submit Reading
          </span>
        </Button>
      </Box>
    </Paper>
  );
};

export default BPInputForm; 