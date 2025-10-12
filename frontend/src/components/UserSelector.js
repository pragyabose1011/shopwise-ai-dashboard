import React from 'react';
import { 
  FormControl, InputLabel, Select, MenuItem, Box, 
  Typography, Avatar, Chip 
} from '@mui/material';
import { useUser } from '../context/UserContext';

const UserSelector = ({ showCurrentUser = true, sx = {} }) => {
  const { currentUser, users, selectUser, getCurrentUserData } = useUser();
  const currentUserData = getCurrentUserData();

  const handleUserChange = (event) => {
    selectUser(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ...sx }}>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Select User</InputLabel>
        <Select
          value={currentUser || ''}
          onChange={handleUserChange}
          label="Select User"
        >
          <MenuItem value="">
            <em>Choose a user</em>
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                {user.name}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {showCurrentUser && currentUser && currentUserData && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Shopping as:
          </Typography>
          <Chip
            avatar={<Avatar>{currentUserData.name.charAt(0).toUpperCase()}</Avatar>}
            label={currentUserData.name}
            color="primary"
            variant="outlined"
          />
        </Box>
      )}

      {!currentUser && showCurrentUser && (
        <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic' }}>
          Please select a user to see personalized features
        </Typography>
      )}
    </Box>
  );
};

export default UserSelector;
