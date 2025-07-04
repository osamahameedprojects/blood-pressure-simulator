import React from 'react';
import { Box, Typography, Chip, Alert } from '@mui/material';

interface FeedbackPanelProps {
  trueSystolic: number;
  trueDiastolic: number;
  enteredSystolic: number;
  enteredDiastolic: number;
  scenarioKey?: string;
}

const getError = (trueVal: number, enteredVal: number) => Math.abs(trueVal - enteredVal);

const getBPCategory = (systolic: number, diastolic: number) => {
  if (systolic < 120 && diastolic < 80) return { category: 'Normal', color: 'success' };
  if (systolic < 130 && diastolic < 80) return { category: 'Elevated', color: 'warning' };
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) return { category: 'Stage 1 Hypertension', color: 'error' };
  if (systolic >= 140 || diastolic >= 90) return { category: 'Stage 2 Hypertension', color: 'error' };
  return { category: 'Unknown', color: 'default' };
};

const getScenarioEducation = (scenarioKey: string | undefined) => {
  switch (scenarioKey) {
    case 'healthy':
      return {
        title: '🫀 Healthy Adult Patient',
        description: 'Normal blood pressure readings indicate good cardiovascular health. This patient likely has no underlying cardiovascular conditions.',
        ranges: 'Expected: Systolic <120 mmHg, Diastolic <80 mmHg',
      };
    case 'hypertensive':
      return {
        title: '⚠️ Hypertensive Patient', 
        description: 'This patient has elevated blood pressure requiring medical attention. Hypertension increases risk of heart disease, stroke, and kidney problems.',
        ranges: 'Expected: Systolic ≥130 mmHg OR Diastolic ≥80 mmHg',
      };
    case 'arrhythmic':
      return {
        title: '💓 Arrhythmic Patient',
        description: 'This patient has irregular heart rhythm. BP readings may fluctuate significantly between beats, making accurate measurement more challenging.',
        ranges: 'Expected: Variable readings due to irregular rhythm',
      };
    default:
      return null;
  }
};

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ trueSystolic, trueDiastolic, enteredSystolic, enteredDiastolic, scenarioKey }) => {
  const sysError = getError(trueSystolic, enteredSystolic);
  const diaError = getError(trueDiastolic, enteredDiastolic);
  const sysColor = sysError <= 5 ? 'success.main' : 'error.main';
  const diaColor = diaError <= 5 ? 'success.main' : 'error.main';
  const isAccurate = sysError <= 5 && diaError <= 5;
  
  const trueBPCategory = getBPCategory(trueSystolic, trueDiastolic);
  const enteredBPCategory = getBPCategory(enteredSystolic, enteredDiastolic);
  const scenarioEducation = getScenarioEducation(scenarioKey);

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Typography variant="h6" mb={2} align="center" fontWeight={600}>
        📊 Measurement Results
      </Typography>
      
      {/* Scenario Education */}
      {scenarioEducation && (
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.85rem', width: '100%' }}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
            {scenarioEducation.title}
          </Typography>
          <Typography variant="body2" display="block" mb={1}>
            {scenarioEducation.description}
          </Typography>
          <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
            {scenarioEducation.ranges}
          </Typography>
        </Alert>
      )}

      {/* Accuracy Summary */}
      <Box display="flex" justifyContent="center" mb={2} width="100%">
        <Chip 
          label={isAccurate ? '✅ Accurate Reading' : '❌ Needs Improvement'} 
          color={isAccurate ? 'success' : 'error'}
          variant="filled"
          sx={{ fontWeight: 600, fontSize: '0.85rem' }}
        />
      </Box>

      {/* BP Readings */}
      <Box mb={2} width="100%">
        <Box display="flex" justifyContent="space-between" mb={1} width="100%">
          <Typography variant="body2" color="text.secondary">True Reading:</Typography>
          <Typography variant="body2" color="primary.main" fontWeight={600}>
            {trueSystolic}/{trueDiastolic} mmHg
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1} width="100%">
          <Typography variant="body2" color="text.secondary">Your Reading:</Typography>
          <Typography variant="body2" fontWeight={600}>
            {enteredSystolic}/{enteredDiastolic} mmHg
          </Typography>
        </Box>
      </Box>

      {/* Error Analysis */}
      <Box mb={2} width="100%">
        <Typography variant="subtitle2" mb={1} fontWeight={600}>Error Analysis:</Typography>
        <Box display="flex" justifyContent="space-between" mb={0.5} width="100%">
          <Typography variant="body2">Systolic Error:</Typography>
          <Typography variant="body2" color={sysColor} fontWeight={600}>
            ±{sysError} mmHg
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="body2">Diastolic Error:</Typography>
          <Typography variant="body2" color={diaColor} fontWeight={600}>
            ±{diaError} mmHg
          </Typography>
        </Box>
      </Box>

      {/* BP Categories */}
      <Box width="100%">
        <Typography variant="subtitle2" mb={1} fontWeight={600}>Blood Pressure Classification:</Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5} width="100%">
          <Typography variant="body2">True Category:</Typography>
          <Chip 
            label={trueBPCategory.category} 
            size="small" 
            color={trueBPCategory.color as any}
            variant="outlined"
          />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant="body2">Your Category:</Typography>
          <Chip 
            label={enteredBPCategory.category} 
            size="small" 
            color={enteredBPCategory.color as any}
            variant="outlined"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FeedbackPanel; 