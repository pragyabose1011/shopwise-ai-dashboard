import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, Card, CardContent,
  Paper, Chip, CircularProgress, Alert, Rating
} from '@mui/material';
import { Refresh, TrendingUp, Psychology } from '@mui/icons-material';
import { getUserRecommendations, generateRecommendations } from '../services/api';
import { useUser } from '../context/UserContext';
import UserSelector from '../components/UserSelector';

const RecommendationCard = ({ recommendation }) => {
  const { product, explanation, algorithm_used, score } = recommendation;

  const getAlgorithmIcon = (algorithm) => {
    switch (algorithm) {
      case 'collaborative': return '👥';
      case 'content-based': return '📊';
      case 'hybrid': return '🧠';
      case 'popularity': return '🔥';
      default: return '🤖';
    }
  };

  const getAlgorithmColor = (algorithm) => {
    switch (algorithm) {
      case 'collaborative': return 'success';
      case 'content-based': return 'info';
      case 'hybrid': return 'secondary';
      case 'popularity': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: '100%', height: 200, objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
          }}
        />
        <Chip
          label={`${Math.round(score * 100)}% match`}
          color="primary"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white'
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 1 }}>
          <Chip 
            label={product.category} 
            size="small" 
            variant="outlined"
          />
        </Box>

        <Typography variant="h6" component="h3" gutterBottom>
          {product.name}
        </Typography>

        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
          ${product.price}
        </Typography>

        {product.average_rating > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.average_rating} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              ({product.average_rating})
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {getAlgorithmIcon(algorithm_used)} Why we recommend this:
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {explanation}
            </Typography>
          </Box>

          <Chip
            label={`${algorithm_used} algorithm`}
            size="small"
            color={getAlgorithmColor(algorithm_used)}
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { currentUser, getCurrentUserData } = useUser();
  const currentUserData = getCurrentUserData();

  useEffect(() => {
    if (currentUser) {
      loadRecommendations();
    }
  }, [currentUser]);

  const loadRecommendations = async (refresh = false) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const response = await getUserRecommendations(currentUser, { refresh });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    if (!currentUser) return;

    setGenerating(true);
    try {
      const response = await generateRecommendations(currentUser, { count: 5 });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Personal Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Discover products tailored specifically for your preferences
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <UserSelector />

          {currentUser && (
            <Button
              variant="contained"
              startIcon={generating ? <CircularProgress size={20} /> : <Refresh />}
              onClick={handleGenerateRecommendations}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Fresh Recommendations'}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Recommendations Content */}
      {!currentUser ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please select a user to see personalized recommendations
        </Alert>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading your personalized recommendations...
          </Typography>
        </Box>
      ) : recommendations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Psychology sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Recommendations Available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {currentUserData?.name} needs to interact with more products to get personalized recommendations.
          </Typography>
          <Button
            variant="contained"
            onClick={handleGenerateRecommendations}
            disabled={generating}
          >
            Try Generate Recommendations
          </Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">
              Recommended for {currentUserData?.name}
            </Typography>
            <Chip
              label={`${recommendations.length} recommendations`}
              color="primary"
              variant="outlined"
            />
          </Box>

          <Grid container spacing={3}>
            {recommendations.map((recommendation) => (
              <Grid item xs={12} sm={6} md={4} key={recommendation.id}>
                <RecommendationCard recommendation={recommendation} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Recommendations;
