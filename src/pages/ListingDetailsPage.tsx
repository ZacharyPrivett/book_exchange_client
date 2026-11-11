import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SkylinePhotoCredit } from '../components/SkylinePhotoCredit';
import { useConditions } from '../hooks/useConditions';
import { useListingDetails } from '../hooks/useListingDetails';
import { bookService } from '../services/bookService';
import type { ListingStatus } from '../types/book';
import { getListingStatusMeta, LISTING_STATUS_OPTIONS, toListingStatus } from '../utils/listingStatus';
import { sanitizeDescriptionHtml } from '../utils/sanitizeHtml';
import './ListingDetailsPage.css';

const formatListedDate = (dateString: string): string => {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString();
};

export const ListingDetailsPage = () => {
  const { id = '' } = useParams();
  const { listing, loading, error, applyListingUpdate } = useListingDetails(id);
  const { conditions, error: conditionsError } = useConditions();
  const description = sanitizeDescriptionHtml(listing?.description);
  const statusMeta = listing ? getListingStatusMeta(listing.status) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [draftNotes, setDraftNotes] = useState('');
  const [draftStatus, setDraftStatus] = useState<ListingStatus>('Available');
  const [draftConditionId, setDraftConditionId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const startEditing = () => {
    if (!listing) return;
    setDraftNotes(listing.notes ?? '');
    setDraftStatus(toListingStatus(listing.status));
    const matchingCondition = conditions.find((condition) => condition.name === listing.conditionName);
    setDraftConditionId(matchingCondition ? String(matchingCondition.id) : '');
    setSaveError('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveError('');
  };

  const handleSave = async () => {
    if (!listing) return;
    setSaving(true);
    setSaveError('');
    try {
      const updated = await bookService.updateListing(String(listing.id), {
        notes: draftNotes.trim() ? draftNotes : null,
        status: draftStatus,
        conditionId: draftConditionId ? Number(draftConditionId) : undefined,
      });
      applyListingUpdate(updated);
      setIsEditing(false);
    } catch {
      setSaveError('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="listing-details-page">
      <Navbar />
      <main className="listing-details-container">
        <Link className="listing-details-back" to="/books">← Back to browse</Link>
        <section className="listing-details-panel">
          {loading && <p role="status">Loading listing...</p>}
          {error && <p className="listing-details-error" role="alert">{error}</p>}
          {listing && statusMeta && (
            <div className="listing-details-layout">
              <div className="listing-details-cover">
                {listing.coverImageUrl ? (
                  <img src={listing.coverImageUrl} alt={`Cover of ${listing.title}`} />
                ) : (
                  <span aria-label="No cover available">📖</span>
                )}
              </div>
              <div className="listing-details-content">
                <span className={`status-banner ${statusMeta.className}`}>{statusMeta.label}</span>
                <h1>{listing.title}</h1>
                <p className="listing-details-authors">
                  {listing.authors.length ? listing.authors.join(', ') : 'Unknown author'}
                </p>
                <dl className="listing-details-facts">
                  <div><dt>Genres</dt><dd>{listing.genres.length ? listing.genres.join(', ') : 'Not specified'}</dd></div>
                  <div><dt>Publisher</dt><dd>{listing.publisher || 'Not specified'}</dd></div>
                  <div><dt>Published year</dt><dd>{listing.publishedYear ?? 'Not specified'}</dd></div>
                  <div><dt>Pages</dt><dd>{listing.pageCount ?? 'Not specified'}</dd></div>
                  <div><dt>Condition</dt><dd><span className="condition-badge">{listing.conditionName}</span></dd></div>
                  <div><dt>Listed by</dt><dd>{listing.ownerDisplayName}</dd></div>
                  <div><dt>Listed on</dt><dd>{formatListedDate(listing.createdAt)}</dd></div>
                </dl>
                <h2>Description</h2>
                {description ? (
                  <div className="listing-details-text" dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                  <p className="listing-details-text">No description provided.</p>
                )}
                <h2>Owner's notes</h2>
                <p className="listing-details-text">{listing.notes || 'No notes provided.'}</p>

                {listing.isOwner && (
                  <div className="listing-owner-panel">
                    <div className="listing-owner-panel-heading">
                      <h2>Manage Your Listing</h2>
                      {!isEditing && (
                        <button type="button" className="listing-edit-btn" onClick={startEditing}>
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form
                        className="listing-edit-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          void handleSave();
                        }}
                      >
                        <label className="listing-edit-field">
                          <span>Notes</span>
                          <textarea
                            value={draftNotes}
                            onChange={(e) => setDraftNotes(e.target.value)}
                            rows={4}
                            placeholder="Add notes for people interested in trading..."
                          />
                        </label>
                        <label className="listing-edit-field">
                          <span>Status</span>
                          <select
                            value={draftStatus}
                            onChange={(e) => setDraftStatus(e.target.value as ListingStatus)}
                          >
                            {LISTING_STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {getListingStatusMeta(status).label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="listing-edit-field">
                          <span>Condition</span>
                          <select
                            value={draftConditionId}
                            onChange={(e) => setDraftConditionId(e.target.value)}
                            required
                          >
                            {!draftConditionId && <option value="">Select a condition...</option>}
                            {conditions.map((condition) => (
                              <option key={condition.id} value={condition.id}>
                                {condition.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        {conditionsError && <p className="listing-details-error" role="alert">{conditionsError}</p>}
                        {saveError && <p className="listing-details-error" role="alert">{saveError}</p>}
                        <div className="listing-edit-actions">
                          <button type="submit" className="listing-save-btn" disabled={saving || !draftConditionId}>
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            type="button"
                            className="listing-cancel-btn"
                            onClick={cancelEditing}
                            disabled={saving}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="listing-owner-hint">
                        Update your notes or change this listing's status whenever you're ready.
                      </p>
                    )}
                  </div>
                )}

                <div className="listing-details-exchange">
                  <h2>Exchange</h2>
                  <p>Exchange requests are not available yet.</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <SkylinePhotoCredit fixed />
    </div>
  );
};
