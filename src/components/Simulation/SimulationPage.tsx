import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography } from '@mui/material';
import SimulatorDisplay from './SimulatorDisplay';
import PumpButton from './PumpButton';
import { useNavigate } from 'react-router-dom';
import { useArduino } from '../../App';

const DEFLATE_INTERVAL = 100; // ms
const DEFLATE_STEP = 1; // mmHg per tick
const SYSTOLIC = 120;
const DIASTOLIC = 80;


// === ARDUINO WEBSOCKET CONFIG ===
const ARDUINO_WS_IP = '192.168.0.6';
const ARDUINO_WS_PORT = 8080;
const ARDUINO_WS_URL = `ws://${ARDUINO_WS_IP}:${ARDUINO_WS_PORT}`;
// ===============================

interface SimulationPageProps {
  size?: 'normal' | 'large';
  trueSystolic?: number;
  trueDiastolic?: number;
  arrhythmic?: boolean;
  onArrhythmicPump?: () => void;
}
const SimulationPage = forwardRef<{ stopSimulation: () => void }, SimulationPageProps>(
  ({ size = 'normal', trueSystolic = 120, trueDiastolic = 80, arrhythmic = false, onArrhythmicPump }, ref) => {
  const [mercury, setMercury] = useState(0);
  const [deflating, setDeflating] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const sendIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const firstPumpRef = useRef(false);
  const deflateRef = useRef<NodeJS.Timeout | null>(null);
  const isPulsePlayingRef = useRef(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mercuryRef = useRef(0);
  const pumpingRef = useRef(false); // Track if user is actively pumping
  const { sendBPUpdate, sendBPEnd } = useArduino();

  // Keep mercuryRef in sync with mercury
  useEffect(() => {
    mercuryRef.current = mercury;
  }, [mercury]);

  // WebSocket connection setup (establish once on mount)
  useEffect(() => {
    const ws = new window.WebSocket(ARDUINO_WS_URL);
    wsRef.current = ws;
    ws.onopen = () => setWsConnected(true);
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'button_pressed') {
          handlePump();
          pumpingRef.current = true;
          if (!firstPumpRef.current) {
            firstPumpRef.current = true;
            // Start sending pressure and overMax every 100ms
            sendIntervalRef.current = setInterval(() => {
              const pressure = mercuryRef.current;
              const overMax = pumpingRef.current && pressure >= 200;
              sendBPUpdate(pressure, overMax);
            }, 100);
          }
        }
      } catch (e) {}
    };
    return () => {
      ws.close();
    };
  // Only run on mount/unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the pressure sent to Arduino on mercury change
  useEffect(() => {
    if (sendIntervalRef.current && wsRef.current && wsRef.current.readyState === 1) {
      // The interval will send the latest mercury value on each tick
      // No action needed here, but this ensures the latest value is used
    }
  }, [mercury]);

  // Deflation interval: only runs when deflating is true
  useEffect(() => {
    if (deflating) {
      deflateRef.current = setInterval(() => {
        setMercury((prev) => {
          const next = prev - DEFLATE_STEP;
          if (next <= 0) {
            clearInterval(deflateRef.current!);
            setDeflating(false);
            return 0;
          }
          return next;
        });
      }, DEFLATE_INTERVAL);
    }
    return () => {
      if (deflateRef.current) clearInterval(deflateRef.current);
    };
  }, [deflating]);

  // Pulse sound logic: play when mercury is in the BP range
  useEffect(() => {
    const inRange = mercury <= trueSystolic && mercury >= trueDiastolic;
    
    if (inRange && !isPulsePlayingRef.current) {
      // Entered range: start playing pulse sound (play once, let it loop naturally)
      isPulsePlayingRef.current = true;
      
      if (!audioRef.current) {
        try {
          audioRef.current = new window.Audio('/pulse.mp3');
          audioRef.current.volume = 0.5;
          audioRef.current.loop = true;
          audioRef.current.preload = 'auto';
          audioRef.current.load();
        } catch (error) {
          audioRef.current = null;
          return;
        }
      }
      
      // Play the pulse sound (it will loop automatically)
      try {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Audio started successfully
            })
            .catch((error) => {
              isPulsePlayingRef.current = false; // Reset on failure
            });
        }
      } catch (error) {
        isPulsePlayingRef.current = false;
      }
      
    } else if (!inRange && isPulsePlayingRef.current) {
      // Exited range: stop pulse sound
      isPulsePlayingRef.current = false;
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [mercury, trueSystolic, trueDiastolic]);

  useEffect(() => {
    return () => {
      if (deflateRef.current) {
        clearInterval(deflateRef.current);
      }
      if (sendIntervalRef.current) {
        clearInterval(sendIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      // Reset pulse playing state
      isPulsePlayingRef.current = false;
    };
  }, []);

  const handlePump = () => {
    if (arrhythmic && onArrhythmicPump) {
      onArrhythmicPump();
    }
    setMercury((prev) => {
      const next = Math.min(prev + 10, 200);
      // Start deflation as soon as we pump above 0 and not already deflating
      if (!deflating && next > 0) {
        setDeflating(true);
      }
      pumpingRef.current = true;
      return next;
    });
  };

  // Expose a function to stop the BP update interval and send bp_end (to be called on form submit)
  useImperativeHandle(ref, () => ({
    stopSimulation: () => {
      if (sendIntervalRef.current) {
        clearInterval(sendIntervalRef.current);
        sendIntervalRef.current = null;
      }
      sendBPEnd();
    }
  }));

  return (
    <Box
      p={size === 'large' ? 4 : 3}
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        transform: size === 'large' ? 'scale(1.2)' : 'none',
        transition: 'transform 0.2s',
        width: '100%',
        maxWidth: size === 'large' ? '800px' : '600px',
        minHeight: 'auto',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(0, 255, 255, 0.4)',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.15), inset 0 0 20px rgba(0, 255, 255, 0.05)',
        position: 'relative',
        margin: '0 auto',
      }}
    >
      <Typography 
        variant="h4" 
        fontWeight={700} 
        mb={2} 
        align="center"
        sx={{
          color: '#00ffff',
          textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
          fontFamily: '"Orbitron", "Roboto Mono", monospace',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 2,
          filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.6))',
          fontSize: { xs: '1.5rem', md: '2rem' },
        }}
      >
BLOOD PRESSURE TRAINING
      </Typography>
      
      <SimulatorDisplay 
        value={mercury} 
        isPulsing={mercury <= trueSystolic && mercury >= trueDiastolic} 
      />
      <PumpButton onPump={handlePump} />
    </Box>
  );
});

export default SimulationPage; 