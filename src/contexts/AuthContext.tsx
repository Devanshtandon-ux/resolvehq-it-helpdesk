import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { DEMO_USERS } from '../services/sampleData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userId?: string, role?: UserRole) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const DEFAULT_ADMIN = DEMO_USERS[0]; // Marcus Sterling

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const storedId = localStorage.getItem('resolvehq_user_id');
      if (storedId) {
        const found = DEMO_USERS.find((u) => u.id === storedId);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN;
  });

  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const u = await api.getCurrentUser();
      if (u) {
        setUser(u);
      }
    } catch (e) {
      console.warn('Could not load current user session, using cached:', e);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (userId?: string, role?: UserRole) => {
    setLoading(true);
    try {
      const res = await api.login({ userId, role });
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (role: UserRole) => {
    setLoading(true);
    try {
      const res = await api.switchRole(role);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setUser(DEFAULT_ADMIN);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        switchRole,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
