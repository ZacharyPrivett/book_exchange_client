import axios from 'axios';
import type {
  BookSearchResult,
  Condition,
  Genre,
  CreateListingRequest,
  CreateManualBookRequest,
  ListingDetails,
} from '../types/book';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7523';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookService = {
  searchBooks: async (query: string): Promise<BookSearchResult[]> => {
    const response = await api.get<BookSearchResult[]>('/books/search', {
      params: { q: query },
    });
    return response.data;
  },

  getConditions: async (): Promise<Condition[]> => {
    const response = await api.get<Condition[]>('/conditions');
    return response.data;
  },

  getGenres: async (): Promise<Genre[]> => {
    const response = await api.get<Genre[]>('/genres');
    return response.data;
  },

  createListing: async (dto: CreateListingRequest): Promise<ListingDetails> => {
    const response = await api.post<ListingDetails>('/books', dto);
    return response.data;
  },

  createManualBook: async (dto: CreateManualBookRequest): Promise<ListingDetails> => {
    const response = await api.post<ListingDetails>('/books/manual', dto);
    return response.data;
  },
};
