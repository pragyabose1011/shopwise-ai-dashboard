import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Container, Paper, Avatar, CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Psychology, Analytics, ShoppingCart 
} from '@mui/icons-material';
import { getPopularProducts } from '../services/api';
import { useUser } from '../context/UserContext';
import ProductCard from '../components/ProductCard';
import UserSelector from '../components/UserSelector';

const Home = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { users } = useUser();

  useEffect(() => {
    loadPopularProducts();
  }, []);

  const loadPopularProducts = async () => {
    try {
      const response = await getPopularProducts(6);
      setPopularProducts(response.data.products);
    } catch (error) {
      console.error('Failed to load popular products:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Personalized Recommendations',
      description: 'Our AI analyzes your preferences and behavior to suggest products you\'ll love',
      color: '#667eea'
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Explanations',
      description: 'Understand why each product is recommended specifically for you',
      color: '#764ba2'
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: 'Smart Analytics',
      description: 'Track your preferences and discover new categories you might enjoy',
      color: '#f093fb'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          px: 4,
          textAlign: 'center',
          borderRadius: 3,
          mb: 4
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to Smart Shop
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Experience AI-powered product recommendations tailored just for you
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            startIcon={<ShoppingCart />}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            Browse Products
          </Button>
          <Button
            component={Link}
            to="/recommendations"
            variant="outlined"
            size="large"
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Get Recommendations
          </Button>
        </Box>
      </Paper>

      {/* User Selection */}
      <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Select Your Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Choose a user profile to experience personalized recommendations
        </Typography>
        <UserSelector />

        {users.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Available Users:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {users.slice(0, 5).map((user) => (
                <Card key={user.id} sx={{ minWidth: 200, textAlign: 'center' }}>
                  <CardContent>
                    <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="subtitle1">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          How It Works
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Box sx={{ color: feature.color, mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Popular Products Section */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Popular Products
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {popularProducts.map((product) => (
              <Grid item xs={12} sm={6 } md={4} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Home;
