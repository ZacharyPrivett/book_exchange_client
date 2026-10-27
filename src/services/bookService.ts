import type {
  BookSearchResult,
  Condition,
  Genre,
  CreateListingRequest,
  CreateManualBookRequest,
  ListingDetails,
  ListingSummary,
} from '../types/book';
import api from './api';

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

  getMyListings: async (): Promise<ListingSummary[]> => {
    const response = await api.get<ListingSummary[]>('/books/mine');
    return response.data;
  },
};
