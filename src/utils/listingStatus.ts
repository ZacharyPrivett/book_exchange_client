import { ListingStatus } from '../types/book';

interface StatusMeta {
  label: string;
  className: string;
}

// Display metadata for every status name the API can return for a listing (see
// BookExchange.Api.Books.Entities.ListingStatus on the backend). This covers all six
// statuses, not just the two owners can edit directly, since a listing can be shown here
// while it's Pending/Exchanged/Removed/Returned. Falls back gracefully for any value the
// API returns that isn't in this list (see getListingStatusMeta).
const LISTING_STATUS_META: Record<string, StatusMeta> = {
  Available: { label: 'Available for Trade', className: 'status-available' },
  Pending: { label: 'Trade Pending', className: 'status-pending' },
  Exchanged: { label: 'Already Exchanged', className: 'status-exchanged' },
  Removed: { label: 'Not Available', className: 'status-removed' },
  Returned: { label: 'Returned', className: 'status-returned' },
  Private: { label: 'Private Listing', className: 'status-private' },
};

// Maps each editable ListingStatus value to its status name, so the edit dropdown can
// reuse the display metadata above.
const EDITABLE_STATUS_NAMES: Record<ListingStatus, string> = {
  [ListingStatus.Available]: 'Available',
  [ListingStatus.Private]: 'Private',
};

/** Options an owner can choose from when editing a listing's status. Only Available and
 * Private are owner-editable; the other statuses represent an active/completed trade and
 * are set by the backend. */
export const LISTING_STATUS_OPTIONS: ListingStatus[] = [
  ListingStatus.Available,
  ListingStatus.Private,
];

export const getListingStatusMeta = (status: string): StatusMeta =>
  LISTING_STATUS_META[status] ?? { label: status, className: 'status-unknown' };

/** Looks up display metadata for one of the owner-editable statuses (used for the edit
 * dropdown's option labels). */
export const getEditableListingStatusMeta = (status: ListingStatus): StatusMeta =>
  getListingStatusMeta(EDITABLE_STATUS_NAMES[status]);

/** True when a listing's current status allows the owner to edit it. A listing that's
 * actively involved in a trade (Pending/Exchanged) or no longer active (Removed/Returned)
 * can't be switched between Available/Private directly. */
export const isListingEditable = (status: string): boolean =>
  status === 'Available' || status === 'Private';

/** Coerces the listing's current status string to the matching editable ListingStatus,
 * defaulting to Available. Callers should guard with isListingEditable before allowing
 * edits at all, since Pending/Exchanged/Removed/Returned have no direct ListingStatus
 * equivalent. */
export const toListingStatus = (status: string): ListingStatus =>
  status === 'Private' ? ListingStatus.Private : ListingStatus.Available;
