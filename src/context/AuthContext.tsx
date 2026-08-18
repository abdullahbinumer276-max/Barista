import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('baristas_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, pass: string) => {
    // Demo authentication check
    if (
      (email.toLowerCase() === 'admin@baristas.pk' && pass === 'baristas123') ||
      (email.toLowerCase() === 'staff@baristas.pk' && pass === 'baristas123') ||
      (email.toLowerCase() === 'manager@baristas.pk' && pass === 'manager123')
    ) {
      const authedUser: AdminUser = {
        id: 'usr-admin-1',
        name: email.startsWith('admin') ? 'Branch Manager (Kharian)' : 'Staff In-charge',
        email,
        role: email.startsWith('admin') ? 'admin' : 'kitchen',
      };
      setUser(authedUser);
      localStorage.setItem('baristas_auth_user', JSON.stringify(authedUser));
    } else {
      throw new Error('Invalid email or password. Try admin@baristas.pk / baristas123');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('baristas_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
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
