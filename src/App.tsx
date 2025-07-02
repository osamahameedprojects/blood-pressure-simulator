import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import ScenarioSelection from './components/Scenario/ScenarioSelection';
import SimulationPage from './components/Simulation/SimulationPage';
import InputPage from './components/Input/InputPage';
import Dashboard from './components/Dashboard/Dashboard';
import NavBar from './components/NavBar';

function App() {
  return (
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
  );
}

export default App;
