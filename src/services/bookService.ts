import api from './api';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  condition: 'Новая' | 'Хорошее' | 'Потертая';
  genre: string;
  description?: string;
  isbn?: string;
  ownerId: string;
  available: boolean;
  deliveryMethods: string[];
  owner?: {
    id: string;
    name: string;
    location: string;
    rating: number;
    totalExchanges: number;
    bio?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookData {
  title: string;
  author: string;
  cover?: string;
  condition: 'Новая' | 'Хорошее' | 'Потертая';
  genre: string;
  description?: string;
  isbn?: string;
  deliveryMethods: string[];
}

export interface GetBooksParams {
  search?: string;
  genre?: string;
  condition?: string;
  location?: string;
  delivery?: string;
  page?: number;
  limit?: number;
}

export interface BooksResponse {
  books: Book[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export const bookService = {
  async getBooks(params?: GetBooksParams): Promise<BooksResponse> {
    const response = await api.get('/books', { params });
    return response.data;
  },

  async getBookById(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async createBook(data: CreateBookData): Promise<Book> {
    const response = await api.post('/books', data);
    return response.data;
  },

  async updateBook(id: string, data: Partial<CreateBookData>): Promise<Book> {
    const response = await api.put(`/books/${id}`, data);
    return response.data;
  },

  async deleteBook(id: string): Promise<void> {
    await api.delete(`/books/${id}`);
  },

  async getMyBooks(): Promise<Book[]> {
    const response = await api.get('/books/my-books');
    return response.data;
  },
};
