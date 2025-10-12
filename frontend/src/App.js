import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

// Components
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Products from './pages/Products';
import Recommendations from './pages/Recommendations';
import Dashboard from './pages/Dashboard';
import UserProvider from './context/UserContext';

// API
import { checkAPIHealth } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      dark: '#764ba2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const [apiHealthy, setApiHealthy] = useState(null);

  useEffect(() => {
    checkAPIHealth()
      .then(() => setApiHealthy(true))
      .catch(() => setApiHealthy(false));
  }, []);

  if (apiHealthy === false) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>⚠️ Backend API Not Available</h2>
        <p>Please make sure the Flask backend is running on port 5000</p>
        <p>Run: <code>cd backend && python app.py</code></p>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Navigation />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Container>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
