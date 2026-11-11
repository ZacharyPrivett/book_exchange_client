import { useEffect, useState } from 'react';
import axios from 'axios';
import { bookService } from '../services/bookService';
import type { ListingDetails } from '../types/book';

interface UseListingDetailsResult {
  listing: ListingDetails | null;
  loading: boolean;
  error: string | null;
  /** Replaces the cached listing (e.g. after a successful edit) without refetching. */
  applyListingUpdate: (updated: ListingDetails) => void;
}

type ListingResult =
  | { id: string; listing: ListingDetails; error: null }
  | { id: string; listing: null; error: string };

/** Fetches a single listing's details by id, handling loading/error state and request cancellation. */
export const useListingDetails = (id: string): UseListingDetailsResult => {
  const [result, setResult] = useState<ListingResult | null>(null);

  useEffect(() => {
    let active = true;

    bookService.getListingDetails(id).then(
      (listing) => {
        if (active) setResult({ id, listing, error: null });
      },
      (err: unknown) => {
        if (!active) return;
        setResult({
          id,
          listing: null,
          error: axios.isAxiosError(err) && err.response?.status === 404
            ? 'This listing could not be found.'
            : 'Could not load this listing. Please try again later.',
        });
      },
    );

    return () => {
      active = false;
    };
  }, [id]);

  // Ignore a stale result left over from a previous id while the new
  // request for the current id is still in flight.
  const current = result?.id === id ? result : null;

  const applyListingUpdate = (updated: ListingDetails) => {
    setResult({ id, listing: updated, error: null });
  };

  return {
    listing: current?.listing ?? null,
    loading: current === null,
    error: current?.error ?? null,
    applyListingUpdate,
  };
};
