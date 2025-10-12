import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Chip, CircularProgress, 
  Paper, TextField, InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import UserSelector from '../components/UserSelector';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await getProducts(params);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Catalog
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Discover amazing products and let us know what you think!
        </Typography>

        <UserSelector sx={{ mb: 3 }} />

        {/* Search */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Category Filters */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Filter by category:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              clickable
              color={selectedCategory === '' ? 'primary' : 'default'}
              onClick={() => handleCategoryFilter('')}
            />
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                clickable
                color={selectedCategory === category ? 'primary' : 'default'}
                onClick={() => handleCategoryFilter(category)}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Products Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            {selectedCategory && ` in ${selectedCategory}`}
          </Typography>

          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard 
                  product={product} 
                  onInteraction={loadProducts}
                />
              </Grid>
            ))}
          </Grid>

          {filteredProducts.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default Products;
