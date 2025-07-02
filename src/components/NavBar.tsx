import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Scenarios', to: '/scenarios' },
];

const NavBar: React.FC = () => {
  const location = useLocation();
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
          Blood Pressure Training Simulator
        </Typography>
        <Box>
          {navLinks.map((link) => (
            <Button
              key={link.to}
              component={Link}
              to={link.to}
              color={location.pathname === link.to ? 'primary' : 'inherit'}
              sx={{ mx: 1, fontWeight: location.pathname === link.to ? 700 : 400 }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 