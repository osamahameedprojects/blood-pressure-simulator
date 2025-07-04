import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Tabs,
  Tab,
  Fade,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ pt: 3, width: '100%', overflow: 'hidden' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const LoginForm: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useUser();

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: 'inherit' };
    if (password.length < 6) return { strength: 25, label: 'Too Short', color: 'error' };
    if (password.length < 8) return { strength: 50, label: 'Weak', color: 'warning' };
    if (password.length < 12) return { strength: 75, label: 'Good', color: 'info' };
    return { strength: 100, label: 'Strong', color: 'success' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password. Please check your credentials.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await signup(email, name, password);
      if (!success) {
        setError('An account with this email already exists. Please login instead.');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
                 <Paper 
           elevation={10} 
           sx={{ 
             p: 4, 
             width: { xs: 350, sm: 450 },
             maxWidth: '90vw',
             background: 'rgba(255, 255, 255, 0.95)',
             backdropFilter: 'blur(10px)',
             borderRadius: 3,
           }}
         >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              mb={1}
              sx={{
                background: 'linear-gradient(45deg, #3A7CA5, #667eea)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={2}>
              Blood Pressure Training Simulator
            </Typography>
            
                         {/* Features */}
             <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} width="100%">
               <Chip label="🎯 Interactive Training" size="small" variant="outlined" />
               <Chip label="🏆 Achievement System" size="small" variant="outlined" />
               <Chip label="📊 Progress Tracking" size="small" variant="outlined" />
             </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                },
              }}
            >
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>
          </Box>

          {/* Error Alert */}
          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          {/* Login Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box 
              component="form" 
              onSubmit={handleLogin} 
              sx={{ 
                minHeight: 340,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <TextField
                label="Email Address"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                sx={{ mb: 2 }}
                placeholder="Enter your email"
              />
              
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                sx={{ mb: 3 }}
                placeholder="Enter your password"
              />
              
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth
                disabled={loading}
                sx={{
                  height: 48,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #3A7CA5, #667eea)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2d5f7f, #5a6fd8)',
                  },
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              
              <Typography variant="body2" color="text.secondary" align="center" mt={2}>
                Don't have an account? Switch to Sign Up tab
              </Typography>
            </Box>
          </TabPanel>

          {/* Signup Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box 
              component="form" 
              onSubmit={handleSignup} 
              sx={{ 
                minHeight: 340,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                sx={{ mb: 2 }}
                placeholder="Enter your full name"
              />
              
              <TextField
                label="Email Address"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                sx={{ mb: 2 }}
                placeholder="Enter your email"
              />
              
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                sx={{ mb: 1 }}
                placeholder="Create a password (min 6 characters)"
              />
              
              {/* Password Strength Indicator */}
              {password && (
                <Box mb={2}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      Password Strength
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={`${passwordStrength.color}.main`}
                      fontWeight={600}
                    >
                      {passwordStrength.label}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.strength}
                    color={passwordStrength.color as any}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    }}
                                     />
                 </Box>
               )}

               {/* Password Requirements */}
               {tabValue === 1 && !password && (
                 <Box mb={2} width="100%">
                   <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                     Password Requirements:
                   </Typography>
                   <Box display="flex" flexWrap="wrap" gap={0.5} width="100%">
                     <Chip label="6+ characters" size="small" variant="outlined" />
                     <Chip label="Secure & memorable" size="small" variant="outlined" />
                   </Box>
                 </Box>
               )}
              
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth
                disabled={loading}
                sx={{
                  height: 48,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #43A047, #66bb6a)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2e7d33, #4caf50)',
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <Typography variant="body2" color="text.secondary" align="center" mt={2}>
                Already have an account? Switch to Login tab
              </Typography>
            </Box>
          </TabPanel>

          {/* Footer */}
          <Box textAlign="center" mt={4} pt={3} borderTop="1px solid" borderColor="divider">
            <Typography variant="caption" color="text.secondary">
              🔒 Your data is stored locally and securely
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default LoginForm; 