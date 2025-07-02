import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import BPInputForm from './BPInputForm';
import FeedbackPanel from './FeedbackPanel';
import BadgeAnimation from './BadgeAnimation';

const TRUE_SYSTOLIC = 120;
const TRUE_DIASTOLIC = 80;

const InputPage: React.FC = () => {
  const [entered, setEntered] = useState<{s: number, d: number} | null>(null);
  const [showBadge, setShowBadge] = useState(false);

  const handleSubmit = (s: number, d: number) => {
    setEntered({ s, d });
    const sysError = Math.abs(TRUE_SYSTOLIC - s);
    const diaError = Math.abs(TRUE_DIASTOLIC - d);
    if (sysError <= 2 && diaError <= 2) {
      setShowBadge(true);
    } else {
      setShowBadge(false);
    }
  };

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" fontWeight={600} mb={3} align="center">
        Enter Your Reading
      </Typography>
      <BPInputForm onSubmit={handleSubmit} />
      {entered && (
        <FeedbackPanel
          trueSystolic={TRUE_SYSTOLIC}
          trueDiastolic={TRUE_DIASTOLIC}
          enteredSystolic={entered.s}
          enteredDiastolic={entered.d}
        />
      )}
      {showBadge && <BadgeAnimation badgeName="Accuracy Ace" />}
    </Box>
  );
};

export default InputPage; 