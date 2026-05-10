import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  location: string;
  bio?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  bio?: string;
  avatar?: string;
  rating: number;
  totalExchanges: number;
  preferences?: {
    genres: string[];
    authors: string[];
  };
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  location: string;
  bio?: string;
  rating: number;
  totalExchanges: number;
  token: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};
