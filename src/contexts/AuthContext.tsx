import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, LoginData, RegisterData } from '../services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      localStorage.setItem('token', response.token);
      const { token, ...userData } = response;
      setUser(userData as User);
      toast.success('Вход выполнен успешно!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка входа';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      localStorage.setItem('token', response.token);
      const { token, ...userData } = response;
      setUser(userData as User);
      toast.success('Регистрация успешна!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка регистрации';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Вы вышли из системы');
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      toast.success('Профиль обновлен');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка обновления профиля';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
