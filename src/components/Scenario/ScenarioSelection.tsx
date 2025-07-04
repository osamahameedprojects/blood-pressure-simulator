import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import ScenarioCard from './ScenarioCard';
import { motion } from 'framer-motion';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import SimulationPage from '../Simulation/SimulationPage';
import BPInputForm from '../Input/BPInputForm';
import FeedbackPanel from '../Input/FeedbackPanel';
import BadgeAnimation from '../Input/BadgeAnimation';
import NavBar from '../NavBar';
import { useUser } from '../../contexts/UserContext';
import { ScenarioKey, SCENARIO_UNLOCK_REQUIREMENTS } from '../../types/user';
import { Alert, Chip, Stack } from '@mui/material';

function randomInRange(min: number, max: number, percent = 0.03) {
  const base = Math.random() * (max - min) + min;
  const jitter = base * (Math.random() * percent * 2 - percent);
  return Math.round(base + jitter);
}

function getScenarioBP(scenario: string): { systolic: number; diastolic: number } {
  if (scenario === 'healthy') {
    // Normal BP: <120 systolic AND <80 diastolic (AHA 2017 Guidelines)
    return {
      systolic: randomInRange(90, 119),
      diastolic: randomInRange(60, 79),
    };
  } else if (scenario === 'hypertensive') {
    // Stage 1 & 2 Hypertension: ≥130 systolic OR ≥80 diastolic
    const stage = Math.random() < 0.7 ? 1 : 2; // 70% Stage 1, 30% Stage 2
    if (stage === 1) {
      // Stage 1: 130-139/80-89 mmHg
      return {
        systolic: randomInRange(130, 139),
        diastolic: randomInRange(80, 89),
      };
    } else {
      // Stage 2: ≥140/≥90 mmHg
      return {
        systolic: randomInRange(140, 170),
        diastolic: randomInRange(90, 110),
      };
    }
  } else if (scenario === 'arrhythmic') {
    // Arrhythmic can occur across BP ranges - simulate irregular rhythm
    const isHealthyBase = Math.random() < 0.5;
    let baseSystolic: number, baseDiastolic: number;
    
    if (isHealthyBase) {
      // Normal BP base
      baseSystolic = randomInRange(90, 119);
      baseDiastolic = randomInRange(60, 79);
    } else {
      // Hypertensive base
      const stage = Math.random() < 0.7 ? 1 : 2;
      if (stage === 1) {
        baseSystolic = randomInRange(130, 139);
        baseDiastolic = randomInRange(80, 89);
      } else {
        baseSystolic = randomInRange(140, 170);
        baseDiastolic = randomInRange(90, 110);
      }
    }
    
    // Add arrhythmic variation (±10-15 mmHg variation to simulate irregular beats)
    const variation = randomInRange(8, 15);
    const systolicVar = (Math.random() - 0.5) * variation;
    const diastolicVar = (Math.random() - 0.5) * (variation * 0.6);
    
    return {
      systolic: Math.max(70, Math.min(200, Math.round(baseSystolic + systolicVar))),
      diastolic: Math.max(40, Math.min(130, Math.round(baseDiastolic + diastolicVar))),
    };
  }
  return { systolic: 120, diastolic: 80 };
}

const ScenarioSelection: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [trueBP, setTrueBP] = useState<{systolic: number, diastolic: number} | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [entered, setEntered] = useState<{s: number, d: number} | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  const [newBadges, setNewBadges] = useState<any[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const navigate = useNavigate();
  const simulationRef = useRef<{ stopSimulation: () => void }>(null);
  const { userProgress, recordAttempt } = useUser();

  // Get scenarios from user progress or create default scenarios
  const scenarios = userProgress?.scenarios || [];

  // Navigation lock (simple version)
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (simulationActive) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [simulationActive]);

  const handleSelect = (scenarioName: string, unlocked: boolean, scenarioKey: string) => {
    if (!unlocked) return;
    setSelected(scenarioName);
    setSelectedKey(scenarioKey);
    setTrueBP(getScenarioBP(scenarioKey));
    setShowStartModal(true);
  };

  const handleStartSimulation = () => {
    setShowStartModal(false);
    setSimulationActive(true);
  };

  const handleInputSubmit = (s: number, d: number) => {
    // Stop simulation interval and send bp_end
    if (simulationRef.current) simulationRef.current.stopSimulation();
    setEntered({ s, d });
    
    if (selectedKey && trueBP) {
      // Record the attempt in user progress
      const result = recordAttempt(
        selectedKey as ScenarioKey,
        trueBP.systolic,
        trueBP.diastolic,
        s,
        d
      );
      
      setShowBadge(result.isCorrect);
      setNewBadges(result.newBadges);
    }
    
    // Show feedback modal instead of auto-navigating
    setShowFeedbackModal(true);
  };

  const handleProceedToDashboard = () => {
    const badgesToCelebrate = newBadges.length > 0 ? newBadges : [];
    
    setShowFeedbackModal(false);
    setEntered(null);
    setShowBadge(false);
    setNewBadges([]);
    setSelected(null);
    setSelectedKey(null);
    setTrueBP(null);
    
    // Pass badge data to dashboard
    navigate('/dashboard', { 
      state: { 
        newBadges: badgesToCelebrate,
        celebrateBadges: badgesToCelebrate.length > 0 
      } 
    });
  };

  // For arrhythmic, jitter BP on each pump
  const handleArrhythmicPump = () => {
    if (selectedKey === 'arrhythmic') {
      setTrueBP(getScenarioBP('arrhythmic'));
    }
  };

  return (
    <Box p={4}>
      {/* Scenario selection, blurred/disabled if simulation is active */}
      <Box sx={{ filter: simulationActive ? 'blur(4px)' : 'none', pointerEvents: simulationActive ? 'none' : 'auto' }}>
        {/* Header with user progress */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={700} mb={2}>
            🎯 Training Scenarios
          </Typography>
          
          {userProgress && (
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" gap={1} mb={3}>
              <Chip 
                label={`Level ${userProgress.level}`} 
                color="primary" 
                variant="filled" 
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={`${userProgress.totalCorrect}/${userProgress.totalAttempts} Correct`} 
                color="success" 
                variant="outlined" 
              />
              <Chip 
                label={`${userProgress.overallAccuracy}% Accuracy`} 
                color="warning" 
                variant="outlined" 
              />
              <Chip 
                label={`🏆 ${userProgress.badges.length} Badges`} 
                color="secondary" 
                variant="outlined" 
              />
            </Stack>
          )}

          {/* Progress requirements for locked scenarios */}
          <Box mb={3}>
            {scenarios.some(s => !s.unlocked) && (
              <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto', borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  🔓 Unlock Requirements:
                </Typography>
                <Stack direction="column" spacing={0.5}>
                  {scenarios.filter(s => !s.unlocked).map(scenario => {
                    const requirements = SCENARIO_UNLOCK_REQUIREMENTS[scenario.scenarioKey as ScenarioKey];
                    const currentCorrect = userProgress?.totalCorrect || 0;
                    return (
                      <Typography key={scenario.scenarioKey} variant="caption" color="text.secondary">
                        <strong>{scenario.scenarioName}:</strong> {currentCorrect}/{requirements.requiredCorrect} correct measurements
                      </Typography>
                    );
                  })}
                </Stack>
              </Alert>
            )}
          </Box>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
            {scenarios.map((scenario) => (
              <Box key={scenario.scenarioName}>
                <ScenarioCard
                  name={scenario.scenarioName}
                  available={scenario.unlocked}
                  selected={selected === scenario.scenarioName}
                  completed={scenario.completed}
                  onClick={() => handleSelect(scenario.scenarioName, scenario.unlocked, scenario.scenarioKey)}
                />
              </Box>
            ))}
          </Box>
        </motion.div>
      </Box>
      {/* Modal overlay for Start Simulation */}
      <Modal open={showStartModal} onClose={() => setShowStartModal(false)}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" sx={{ bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)' }}>
          <Typography variant="h5" mb={3}>Start Simulation for {selected}</Typography>
          <Button variant="contained" color="primary" size="large" onClick={handleStartSimulation}>
            Start Simulation
          </Button>
        </Box>
      </Modal>
      {/* Side-by-side simulation and input form */}
      {simulationActive && (
        <Box
          minHeight="100vh"
          width="100vw"
          display="flex"
          flexDirection="column"
          bgcolor="#fff"
          position="fixed"
          top={0}
          left={0}
          zIndex={1300}
        >
          {/* Website NavBar */}
          <NavBar />
          
          {/* Training Header with Exit Button */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            sx={{
              background: 'rgba(58, 124, 165, 0.1)',
              borderBottom: '1px solid rgba(58, 124, 165, 0.2)',
              mt: -3, // Compensate for NavBar's bottom margin
            }}
          >
            <Typography variant="h6" fontWeight={600} color="primary.main">
              📋 Training Session: {selected}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                if (simulationRef.current) simulationRef.current.stopSimulation();
                setSimulationActive(false);
                setEntered(null);
                setShowBadge(false);
                setNewBadges([]);
                setSelected(null);
                setSelectedKey(null);
                setTrueBP(null);
              }}
              sx={{
                fontWeight: 600,
                borderRadius: '8px',
              }}
            >
              Exit Training
            </Button>
          </Box>
          
          {/* Main Content Area */}
          <Box
            flex={1}
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent="center"
            alignItems="center"
            gap={2}
            p={3}
            sx={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
          >
          {/* Content Wrapper - shifted to right */}
          <Box 
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={2}
            alignItems="center"
            sx={{
              ml: { xs: 0, md: 4 }, // Move just the content to the right
            }}
          >
          {/* Left: Simulation (larger) */}
          <Box flex={2} minWidth={420} maxWidth={600} display="flex" justifyContent="center" alignItems="center">
            <SimulationPage
              ref={simulationRef}
              size="large"
              trueSystolic={trueBP?.systolic}
              trueDiastolic={trueBP?.diastolic}
              arrhythmic={selectedKey === 'arrhythmic'}
              onArrhythmicPump={handleArrhythmicPump}
            />
          </Box>
          {/* Right: Input form and feedback (overlapping) */}
          <Box 
            flex={1} 
            minWidth={260} 
            maxWidth={340} 
            display="flex" 
            flexDirection="column" 
            alignItems="center"
            sx={{
              marginLeft: { xs: 0, md: '-60px' },
              position: 'relative',
              zIndex: 1400,
            }}
          >
            <BPInputForm onSubmit={handleInputSubmit} />
          </Box>
          </Box>
          </Box>
        </Box>
      )}

      {/* Feedback Results Modal */}
      <Modal open={showFeedbackModal} onClose={() => {}}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="100vh" 
          p={3}
          sx={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.8)', 
            backdropFilter: 'blur(10px)',
            zIndex: 1300,
          }}
        >
          <Box 
            sx={{
              bgcolor: 'white',
              borderRadius: '20px',
              p: 0,
              maxWidth: '520px',
              width: '90%',
              overflow: 'visible',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            {entered && trueBP && (
              <FeedbackPanel
                trueSystolic={trueBP.systolic}
                trueDiastolic={trueBP.diastolic}
                enteredSystolic={entered.s}
                enteredDiastolic={entered.d}
                scenarioKey={selectedKey || undefined}
              />
            )}
            
            {/* Success Message */}
            {showBadge && (
              <Box p={3} pt={1}>
                <Box display="flex" justifyContent="center" mb={2}>
                  <Chip 
                    label="🎉 Excellent Work!" 
                    color="success"
                    variant="filled"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      py: 1.5,
                      px: 2.5,
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Fixed Proceed Button */}
            <Box 
              p={3} 
              pt={2}
              sx={{
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                fullWidth
                onClick={handleProceedToDashboard}
                sx={{ 
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: 'linear-gradient(45deg, #3A7CA5, #667eea)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2d6086, #5a70d8)',
                  }
                }}
              >
                ➤ Proceed
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ScenarioSelection; 