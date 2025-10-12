import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Paper,
  CircularProgress, Alert, Chip, Avatar, LinearProgress
} from '@mui/material';
import {
  Person, TrendingUp, Star, Favorite,
  Visibility, TouchApp
} from '@mui/icons-material';
import { getUserStats, getUserInteractions } from '../services/api';
import { useUser } from '../context/UserContext';
import UserSelector from '../components/UserSelector';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: `${color}.main` }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}.main` }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const CategoryPreferenceBar = ({ category, count, maxCount }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {category}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {count} interactions
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={(count / maxCount) * 100}
      sx={{ height: 8, borderRadius: 4 }}
    />
  </Box>
);

const Dashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser, getCurrentUserData } = useUser();
  const currentUserData = getCurrentUserData();

  useEffect(() => {
    if (currentUser) {
      loadUserDashboard();
    }
  }, [currentUser]);

  const loadUserDashboard = async () => {
    setLoading(true);
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        getUserStats(currentUser),
        getUserInteractions(currentUser, { limit: 10 })
      ]);

      setUserStats(statsResponse.data);
      setRecentActivity(activityResponse.data.interactions);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'view': return <Visibility />;
      case 'click': return <TouchApp />;
      case 'rating': return <Star />;
      case 'favorite': return <Favorite />;
      default: return <Person />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Track your activity and preferences
        </Typography>

        <UserSelector />
      </Paper>

      {!currentUser ? (
        <Alert severity="info">
          Please select a user to view their dashboard
        </Alert>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : userStats ? (
        <Grid container spacing={3}>
          {/* Stats Overview */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Activity Overview for {currentUserData?.name}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Interactions"
              value={userStats.total_interactions}
              icon={<TrendingUp />}
              color="primary"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Average Rating"
              value={userStats.user.average_rating?.toFixed(1) || '0.0'}
              icon={<Star />}
              color="warning"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Categories Explored"
              value={userStats.category_preferences?.length || 0}
              icon={<Favorite />}
              color="success"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Since"
              value={formatDate(userStats.user.created_at)}
              icon={<Person />}
              color="info"
            />
          </Grid>

          {/* Interaction Breakdown */}
          {userStats.interaction_counts && Object.keys(userStats.interaction_counts).length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Interaction Breakdown
                  </Typography>
                  {Object.entries(userStats.interaction_counts).map(([type, count]) => (
                    <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getInteractionIcon(type)}
                        <Typography variant="body1">
                          {type.charAt(0).toUpperCase() + type.slice(1)}s
                        </Typography>
                      </Box>
                      <Chip label={count} color="primary" size="small" />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Category Preferences */}
          {userStats.category_preferences && userStats.category_preferences.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Category Preferences
                  </Typography>
                  {userStats.category_preferences.slice(0, 5).map((pref) => (
                    <CategoryPreferenceBar
                      key={pref.category}
                      category={pref.category}
                      count={pref.interaction_count}
                      maxCount={Math.max(...userStats.category_preferences.map(p => p.interaction_count))}
                    />
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  {recentActivity.map((activity) => (
                    <Box
                      key={activity.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 'none' }
                      }}
                    >
                      <Box sx={{ mr: 2 }}>
                        {getInteractionIcon(activity.interaction_type)}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1">
                          <strong>{activity.interaction_type.charAt(0).toUpperCase() + activity.interaction_type.slice(1)}</strong> {activity.product_name}
                        </Typography>
                        {activity.rating && (
                          <Typography variant="body2" color="text.secondary">
                            Rating: {activity.rating}⭐
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(activity.timestamp)}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      ) : (
        <Alert severity="error">
          Failed to load dashboard data
        </Alert>
      )}
    </Box>
  );
};

export default Dashboard;
