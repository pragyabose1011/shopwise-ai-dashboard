import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsers } from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
    // Load saved user from localStorage
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      setCurrentUser(parseInt(savedUserId));
    }
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (userId) => {
    setCurrentUser(userId);
    localStorage.setItem('currentUserId', userId.toString());
  };

  const getCurrentUserData = () => {
    return users.find(user => user.id === currentUser);
  };

  const value = {
    currentUser,
    users,
    loading,
    selectUser,
    getCurrentUserData,
    loadUsers
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
