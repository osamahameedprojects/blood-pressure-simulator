import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import ScenarioSelection from './components/Scenario/ScenarioSelection';
import SimulationPage from './components/Simulation/SimulationPage';
import InputPage from './components/Input/InputPage';
import Dashboard from './components/Dashboard/Dashboard';
import NavBar from './components/NavBar';

// === ARDUINO WEBSOCKET PROVIDER ===
const ARDUINO_WS_IP = '192.168.0.6';
const ARDUINO_WS_PORT = 8080;
const ARDUINO_WS_URL = `ws://${ARDUINO_WS_IP}:${ARDUINO_WS_PORT}`;

interface ArduinoContextType {
  sendBPUpdate: (pressure: number, overMax: boolean) => void;
  sendBPEnd: () => void;
  connected: boolean;
}
const ArduinoContext = createContext<ArduinoContextType | undefined>(undefined);

export const useArduino = () => {
  const ctx = useContext(ArduinoContext);
  if (!ctx) throw new Error('useArduino must be used within ArduinoProvider');
  return ctx;
};

const ArduinoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new window.WebSocket(ARDUINO_WS_URL);
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    return () => ws.close();
  }, []);

  const sendBPUpdate = (pressure: number, overMax: boolean) => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify({ event: 'bp_update', pressure, overMax }));
    }
  };
  const sendBPEnd = () => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify({ event: 'bp_end' }));
    }
  };

  return (
    <ArduinoContext.Provider value={{ sendBPUpdate, sendBPEnd, connected }}>
      {children}
    </ArduinoContext.Provider>
  );
};

function App() {
  return (
    <ArduinoProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/scenarios" element={<ScenarioSelection />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ArduinoProvider>
  );
}

export default App;
