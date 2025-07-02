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
const PULSE_INTERVAL = 800; // ms

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
  const pulseRef = useRef<NodeJS.Timeout | null>(null);
  const inRangeRef = useRef(false);
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

  // Pulse sound interval: only runs while mercury is in range (trueSystolic to trueDiastolic)
  useEffect(() => {
    const inRange = mercury <= trueSystolic && mercury >= trueDiastolic;
    console.log(`Pulse check: mercury=${mercury}, systolic=${trueSystolic}, diastolic=${trueDiastolic}, inRange=${inRange}`);
    if (inRange && !inRangeRef.current) {
      // Entered range: start pulse interval
      inRangeRef.current = true;
      if (!audioRef.current) {
        audioRef.current = new window.Audio('/pulse.mp3');
        audioRef.current.volume = 1; // Set volume to 50%
      }
      const playPulse = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((error) => {
            console.log('Audio play failed:', error);
          });
        }
      };
      pulseRef.current = setInterval(playPulse, PULSE_INTERVAL);
      playPulse(); // Play immediately
      console.log('Pulse sound started');
    } else if (!inRange && inRangeRef.current) {
      // Exited range: stop pulse interval
      inRangeRef.current = false;
      if (pulseRef.current) {
        clearInterval(pulseRef.current);
        pulseRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      console.log('Pulse sound stopped');
    }
    // Cleanup on unmount
    return () => {
      if (pulseRef.current) {
        clearInterval(pulseRef.current);
        pulseRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [mercury, trueSystolic, trueDiastolic]);

  useEffect(() => {
    return () => {
      if (deflateRef.current) clearInterval(deflateRef.current);
      if (pulseRef.current) clearInterval(pulseRef.current);
      if (sendIntervalRef.current) clearInterval(sendIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (wsRef.current) wsRef.current.close();
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
      p={size === 'large' ? 6 : 4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        transform: size === 'large' ? 'scale(1.5)' : 'none',
        transition: 'transform 0.2s',
        minWidth: size === 'large' ? 560 : 360,
        minHeight: size === 'large' ? 420 : 280,
      }}
    >
      <Typography variant="h4" fontWeight={600} mb={3} align="center">
        Simulation
      </Typography>
      <SimulatorDisplay value={mercury} />
      <PumpButton onPump={handlePump} />
    </Box>
  );
});

export default SimulationPage; 