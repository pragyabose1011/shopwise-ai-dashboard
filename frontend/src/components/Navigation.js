import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Chip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Recommend, Dashboard, Home } from '@mui/icons-material';
import { useUser } from '../context/UserContext';

const Navigation = () => {
  const location = useLocation();
  const { currentUser, getCurrentUserData } = useUser();
  const userData = getCurrentUserData();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home /> },
    { path: '/products', label: 'Products', icon: <ShoppingCart /> },
    { path: '/recommendations', label: 'Recommendations', icon: <Recommend /> },
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  ];

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
        >
          🛍️ Smart Shop
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              startIcon={item.icon}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}

          {currentUser && userData && (
            <Chip
              avatar={<Avatar>{userData.name.charAt(0).toUpperCase()}</Avatar>}
              label={userData.name}
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '& .MuiAvatar-root': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                },
              }}
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
