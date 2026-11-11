import { ListingStatus } from '../types/book';

interface StatusMeta {
  label: string;
  className: string;
}

// Display metadata for each known listing status. Falls back gracefully for
// any value the API returns that isn't in this list (see getListingStatusMeta).
const LISTING_STATUS_META: Record<ListingStatus, StatusMeta> = {
  [ListingStatus.Available]: { label: 'Available for Trade', className: 'status-available' },
  [ListingStatus.Pending]: { label: 'Trade Pending', className: 'status-pending' },
  [ListingStatus.Exchanged]: { label: 'Already Exchanged', className: 'status-exchanged' },
  [ListingStatus.Removed]: { label: 'Not Available', className: 'status-removed' },
  [ListingStatus.Returned]: { label: 'Returned', className: 'status-returned' },
  [ListingStatus.Private]: { label: 'Private Listing', className: 'status-private' },
};

/** Options an owner can choose from when editing a listing's status. */
export const LISTING_STATUS_OPTIONS: ListingStatus[] = [
  ListingStatus.Available,
  ListingStatus.Pending,
  ListingStatus.Exchanged,
  ListingStatus.Removed,
  ListingStatus.Returned,
  ListingStatus.Private,
];

export const getListingStatusMeta = (status: string): StatusMeta =>
  LISTING_STATUS_META[status as ListingStatus] ?? { label: status, className: 'status-unknown' };

/** Coerces an arbitrary status string to a known ListingStatus, defaulting to Available. */
export const toListingStatus = (status: string): ListingStatus =>
  (LISTING_STATUS_OPTIONS as string[]).includes(status) ? (status as ListingStatus) : ListingStatus.Available;
