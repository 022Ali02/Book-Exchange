import api from './api';
import { Book } from './bookService';

export interface Exchange {
  id: string;
  requesterId: string;
  ownerId: string;
  requesterBookId: string;
  ownerBookId: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  meetingDetails?: {
    time?: string;
    location?: string;
    method?: string;
  };
  rating?: {
    requesterRating?: number;
    ownerRating?: number;
  };
  requester: {
    id: string;
    name: string;
    location: string;
    rating: number;
  };
  owner: {
    id: string;
    name: string;
    location: string;
    rating: number;
  };
  requesterBook: Book;
  ownerBook: Book;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExchangeData {
  ownerBookId: string;
  requesterBookId: string;
}

export interface UpdateExchangeStatusData {
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  meetingDetails?: {
    time?: string;
    location?: string;
    method?: string;
  };
}

export const exchangeService = {
  async createExchange(data: CreateExchangeData): Promise<Exchange> {
    const response = await api.post('/exchanges', data);
    return response.data;
  },

  async getExchanges(type?: 'incoming' | 'outgoing'): Promise<Exchange[]> {
    const response = await api.get('/exchanges', {
      params: type ? { type } : undefined,
    });
    return response.data;
  },

  async getExchangeById(id: string): Promise<Exchange> {
    const response = await api.get(`/exchanges/${id}`);
    return response.data;
  },

  async updateExchangeStatus(
    id: string,
    data: UpdateExchangeStatusData
  ): Promise<Exchange> {
    const response = await api.put(`/exchanges/${id}/status`, data);
    return response.data;
  },

  async rateExchange(id: string, rating: number): Promise<void> {
    await api.post(`/exchanges/${id}/rate`, { rating });
  },
};
