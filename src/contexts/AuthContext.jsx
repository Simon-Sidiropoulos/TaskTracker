import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const isLoading = false;

  const signup = (email, password, name) => {
    // Check if user already exists
    const usersDb = JSON.parse(localStorage.getItem('usersDb') || '{}');
    
    if (usersDb[email]) {
      alert('User already exists. Please login instead.');
      return null;
    }

    const newUser = {
      id: email, // Use email as stable ID
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    
    // Save to users database
    usersDb[email] = newUser;
    localStorage.setItem('usersDb', JSON.stringify(usersDb));
    
    // Set as current user
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  };

  const login = (email, password) => {
    // Get users database
    const usersDb = JSON.parse(localStorage.getItem('usersDb') || '{}');
    
    // Check if user exists
    if (usersDb[email]) {
      const userData = usersDb[email];
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    }
    
    // Create new user if none exists
    return signup(email, password, email.split('@')[0]);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // Update in users database
    const usersDb = JSON.parse(localStorage.getItem('usersDb') || '{}');
    usersDb[user.email] = updatedUser;
    localStorage.setItem('usersDb', JSON.stringify(usersDb));
    
    // Update current user
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
