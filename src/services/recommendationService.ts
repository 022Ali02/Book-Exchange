import api from './api';
import { Book } from './bookService';

export interface AIRecommendation extends Book {
  aiRecommendation: string;
  score: number;
}

export interface WishlistItem {
  id: string;
  userId: string;
  bookId: string;
  book: Book;
  createdAt: string;
}

export const recommendationService = {
  async getAIRecommendations(): Promise<AIRecommendation[]> {
    const response = await api.get('/recommendations/ai-match');
    return response.data;
  },

  async addToWishlist(bookId: string): Promise<WishlistItem> {
    const response = await api.post('/recommendations/wishlist', { bookId });
    return response.data;
  },

  async getWishlist(): Promise<WishlistItem[]> {
    const response = await api.get('/recommendations/wishlist');
    return response.data;
  },

  async removeFromWishlist(bookId: string): Promise<void> {
    await api.delete(`/recommendations/wishlist/${bookId}`);
  },
};
