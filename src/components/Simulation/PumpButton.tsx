import React from 'react';
import { Button } from '@mui/material';

interface PumpButtonProps {
  onPump: () => void;
}

const PumpButton: React.FC<PumpButtonProps> = ({ onPump }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      sx={{ mt: 4, px: 6, py: 2, fontWeight: 600, fontSize: '1.2rem' }}
      onClick={onPump}
    >
      Pump (Manual)
    </Button>
  );
};

export default PumpButton; 