import React, { useState } from 'react';
import {
  Card, CardMedia, CardContent, Typography, Button, Box, Rating,
  IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Favorite, FavoriteBorder, Visibility } from '@mui/icons-material';
import { recordInteraction } from '../services/api';
import { useUser } from '../context/UserContext';

const ProductCard = ({ product, onInteraction }) => {
  const { currentUser } = useUser();
  const [ratingOpen, setRatingOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleView = async () => {
    if (currentUser) {
      try {
        await recordInteraction({
          user_id: currentUser,
          product_id: product.id,
          interaction_type: 'view'
        });
        onInteraction && onInteraction();
      } catch (error) {
        console.error('Failed to record view:', error);
      }
    }
  };

  const handleFavorite = async () => {
    if (!currentUser) {
      alert('Please select a user first!');
      return;
    }

    try {
      await recordInteraction({
        user_id: currentUser,
        product_id: product.id,
        interaction_type: 'favorite'
      });
      setIsFavorite(!isFavorite);
      onInteraction && onInteraction();
    } catch (error) {
      console.error('Failed to record favorite:', error);
    }
  };

  const handleRating = async () => {
    if (!currentUser) {
      alert('Please select a user first!');
      return;
    }

    if (userRating === 0) {
      alert('Please select a rating!');
      return;
    }

    try {
      await recordInteraction({
        user_id: currentUser,
        product_id: product.id,
        interaction_type: 'rating',
        rating: userRating
      });
      setRatingOpen(false);
      onInteraction && onInteraction();
    } catch (error) {
      console.error('Failed to record rating:', error);
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          },
        }}
        onClick={handleView}
      >
        <CardMedia
          component="img"
          height="200"
          image={product.image_url}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
          }}
        />

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: 1 }}>
            <Chip 
              label={product.category} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Box>

          <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {product.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {product.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mr: 2 }}>
              ${product.price}
            </Typography>
            {product.average_rating > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={product.average_rating} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  ({product.average_rating})
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Visibility />}
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
            >
              View
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setRatingOpen(true);
              }}
            >
              Rate
            </Button>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleFavorite();
              }}
              color={isFavorite ? 'error' : 'default'}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Box>

          {product.interaction_count > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {product.interaction_count} interactions
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Rating Dialog */}
      <Dialog open={ratingOpen} onClose={() => setRatingOpen(false)}>
        <DialogTitle>Rate {product.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Rating
              value={userRating}
              onChange={(event, newValue) => setUserRating(newValue)}
              size="large"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRatingOpen(false)}>Cancel</Button>
          <Button onClick={handleRating} variant="contained">Submit Rating</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCard;
