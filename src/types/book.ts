// Matches BookExchange.Api.Books.Dtos.BookSearchResultSource
export const BookSearchResultSource = {
  Local: 0,
  GoogleBooks: 1,
  Manual: 2,
} as const;
export type BookSearchResultSource = (typeof BookSearchResultSource)[keyof typeof BookSearchResultSource];

// Matches BookExchange.Api.Books.Dtos.BookSearchResultDto
export interface BookSearchResult {
  catalogId: number | null;
  googleBooksId: string | null;
  title: string;
  authors: string[];
  categories: string[];
  publisher: string | null;
  publishedYear: number | null;
  pageCount: number | null;
  coverImageUrl: string | null;
  description: string | null;
  isbn10: string | null;
  isbn13: string | null;
  source: BookSearchResultSource;
}

// Matches BookExchange.Api.Books.Dtos.ConditionDto
export interface Condition {
  id: number;
  name: string;
}

// Matches BookExchange.Api.Books.Dtos.GenreDto
export interface Genre {
  id: number;
  name: string;
}

// Matches BookExchange.Api.Books.Dtos.CreateListingDto
export interface CreateListingRequest {
  catalogId?: number | null;
  googleBooksId?: string | null;
  conditionId: number;
  notes?: string | null;
}

// Matches BookExchange.Api.Books.Dtos.CreateManualBookDto
export interface CreateManualBookRequest {
  title: string;
  authors: string[];
  genres?: string[] | null;
  publisher?: string | null;
  publishedYear?: number | null;
  pageCount?: number | null;
  coverImageUrl?: string | null;
  description?: string | null;
  isbn10?: string | null;
  isbn13?: string | null;
  conditionId: number;
  notes?: string | null;
}

// Matches BookExchange.Api.Books.Dtos.ListingDetailsDto
export interface ListingDetails {
  id: number;
  title: string;
  authors: string[];
  genres: string[];
  publisher: string | null;
  publishedYear: number | null;
  pageCount: number | null;
  coverImageUrl: string | null;
  description: string | null;
  conditionName: string;
  status: string;
  notes: string | null;
  ownerDisplayName: string;
  createdAt: string;
  // Pending backend support: true when the authenticated caller owns this
  // listing. Absent/undefined is treated as false, so owner-only UI stays
  // hidden until the API starts sending this field.
  isOwner?: boolean;
}

// Matches BookExchange.Api.Books.Dtos.ListingStatus (string values from
// listing.Status.ToString())
export const ListingStatus = {
  Available: 'Available',
  Pending: 'Pending',
  Exchanged: 'Exchanged',
  Removed: 'Removed',
  Returned: 'Returned',
  Private: 'Private',
} as const;
export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];

// Pending backend support: body for PATCH /books/{id}
export interface UpdateListingRequest {
  notes?: string | null;
  status?: ListingStatus;
  conditionId?: number;
}

// Matches BookExchange.Api.Books.Dtos.ListingSummaryDto
export interface ListingSummary {
  id: number;
  title: string;
  authors: string[];
  coverImageUrl: string | null;
  conditionName: string;
  status: string;
}
