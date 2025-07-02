import React, { useState } from 'react';
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

const scenarios = [
  { name: 'Healthy Adult', available: true, completed: true },
  { name: 'Hypertensive', available: true, completed: false },
  { name: 'Arrhythmic', available: false, completed: false },
];

const TRUE_SYSTOLIC = 120;
const TRUE_DIASTOLIC = 80;

const ScenarioSelection: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [entered, setEntered] = useState<{s: number, d: number} | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  const navigate = useNavigate();

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

  const handleSelect = (name: string, available: boolean) => {
    if (!available) return;
    setSelected(name);
    setShowStartModal(true);
  };

  const handleStartSimulation = () => {
    setShowStartModal(false);
    setSimulationActive(true);
  };

  const handleInputSubmit = (s: number, d: number) => {
    setEntered({ s, d });
    const sysError = Math.abs(TRUE_SYSTOLIC - s);
    const diaError = Math.abs(TRUE_DIASTOLIC - d);
    if (sysError <= 2 && diaError <= 2) {
      setShowBadge(true);
    } else {
      setShowBadge(false);
    }
    // After feedback, redirect to dashboard after a short delay
    setTimeout(() => {
      setEntered(null);
      setShowBadge(false);
      setSelected(null);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Box p={4}>
      {/* Scenario selection, blurred/disabled if simulation is active */}
      <Box sx={{ filter: simulationActive ? 'blur(4px)' : 'none', pointerEvents: simulationActive ? 'none' : 'auto' }}>
        <Typography variant="h4" fontWeight={600} mb={3} align="center">
          Select a Scenario
        </Typography>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
            {scenarios.map((scenario) => (
              <Box key={scenario.name}>
                <ScenarioCard
                  name={scenario.name}
                  available={scenario.available}
                  selected={selected === scenario.name}
                  completed={scenario.completed}
                  onClick={() => handleSelect(scenario.name, scenario.available)}
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
          mt={0}
          minHeight="100vh"
          width="100vw"
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="center"
          alignItems="center"
          gap={6}
          bgcolor="#fff"
          position="fixed"
          top={0}
          left={0}
          zIndex={1300}
        >
          {/* Left: Simulation (larger) */}
          <Box flex={2} minWidth={420} maxWidth={600} display="flex" justifyContent="center" alignItems="center">
            <SimulationPage size="large" />
          </Box>
          {/* Right: Input form and feedback (smaller) */}
          <Box flex={1} minWidth={260} maxWidth={340} display="flex" flexDirection="column" alignItems="center">
            <BPInputForm onSubmit={handleInputSubmit} />
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
        </Box>
      )}
    </Box>
  );
};

export default ScenarioSelection; 