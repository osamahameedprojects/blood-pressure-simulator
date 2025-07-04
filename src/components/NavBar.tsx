import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  Chip, 
  IconButton,
  Divider 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProgress, isAuthenticated, logout } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Don't show navbar on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <AppBar 
      position="static" 
      elevation={2} 
      sx={{ 
        background: 'linear-gradient(45deg, #3A7CA5, #667eea)',
        backdropFilter: 'blur(10px)',
        mb: 3,
      }}
    >
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'white',
          }}
          onClick={() => navigate('/scenarios')}
        >
          <Box 
            component="span" 
            sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              fontSize: '1.4rem',
              marginRight: '12px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            🩺
          </Box> 
          BP Simulator
          {userProgress && (
            <Chip 
              label={`Level ${userProgress.level}`} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
              }} 
            />
          )}
        </Typography>

        {isAuthenticated && (
          <Box display="flex" alignItems="center" gap={2}>
            {/* Navigation Buttons */}
            <Box display="flex" gap={1}>
              <Button 
                color="inherit" 
                onClick={() => navigate('/scenarios')}
                sx={{ 
                  fontWeight: isActive('/scenarios') ? 700 : 500,
                  bgcolor: isActive('/scenarios') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                🎯 Scenarios
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  fontWeight: isActive('/dashboard') ? 700 : 500,
                  bgcolor: isActive('/dashboard') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                📊 Dashboard
              </Button>
            </Box>

            {/* User Stats */}
            {userProgress && (
              <Box display={{ xs: 'none', md: 'flex' }} alignItems="center" gap={1}>
                <Chip 
                  label={`${userProgress.totalCorrect} Correct`} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(76, 175, 80, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                  }} 
                />
                <Chip 
                  label={`${userProgress.overallAccuracy}% Accuracy`} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(255, 193, 7, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                  }} 
                />
              </Box>
            )}

            {/* User Menu */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
              sx={{
                border: '2px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                {user ? getInitials(user.name) : 'U'}
              </Avatar>
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              {user && (
                <Box px={2} py={1}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              )}
              <Divider />
              {userProgress && (
                <>
                  <MenuItem>
                    <Box>
                      <Typography variant="body2">
                        🏆 {userProgress.badges.length} Badges Earned
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        🔥 {userProgress.currentStreak} Current Streak
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                </>
              )}
              <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
                📊 View Dashboard
              </MenuItem>
              <MenuItem onClick={() => { navigate('/scenarios'); handleMenuClose(); }}>
                🎯 Practice Scenarios
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                🚪 Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 