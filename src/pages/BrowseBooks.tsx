import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SkylinePhotoCredit } from '../components/SkylinePhotoCredit';
import { bookService } from '../services/bookService';
import type { ListingSummary } from '../types/book';
import './BrowseBooks.css';

export const BrowseBooks = () => {
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    bookService
      .getAllListings()
      .then(setListings)
      .catch(() => setListingsError('Could not load listings. Please try again later.'))
      .finally(() => setListingsLoading(false));
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredListings = normalizedQuery
    ? listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(normalizedQuery) ||
          listing.authors.some((author) => author.toLowerCase().includes(normalizedQuery))
      )
    : listings;

  return (
    <div className="browse-books">
      <Navbar />
      <div className="browse-books-container">
        <section className="browse-header">
          <h1>Browse Books 🔍</h1>
          <p>Discover books available for exchange in the Queen City.</p>
          <div className="browse-search">
            <input
              type="text"
              placeholder="Search listings by title or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </section>

        <section className="browse-listings">
          <div className="browse-listings-heading">
            <div>
              <h2>All Listings</h2>
              <p>Every book our community has listed for exchange.</p>
            </div>
          </div>

          {listingsLoading && <p className="browse-message">Loading listings...</p>}
          {!listingsLoading && listingsError && (
            <p className="browse-message browse-error">{listingsError}</p>
          )}
          {!listingsLoading && !listingsError && listings.length === 0 && (
            <div className="browse-empty">
              <span className="browse-empty-icon">📚</span>
              <p>No books have been listed yet.</p>
            </div>
          )}
          {!listingsLoading && !listingsError && listings.length > 0 && filteredListings.length === 0 && (
            <div className="browse-empty">
              <span className="browse-empty-icon">🔍</span>
              <p>No books match your search.</p>
              <button className="browse-clear" onClick={() => setQuery('')}>
                Clear search
              </button>
            </div>
          )}
          {!listingsLoading && !listingsError && filteredListings.length > 0 && (
            <div className="browse-grid">
              {filteredListings.map((listing) => (
                <Link key={listing.id} className="browse-card" to={`/books/${listing.id}`}>
                  <div className="browse-cover">
                    {listing.coverImageUrl ? (
                      <img src={listing.coverImageUrl} alt={`Cover of ${listing.title}`} />
                    ) : (
                      <span>📖</span>
                    )}
                  </div>
                  <div className="browse-card-content">
                    <h3>{listing.title}</h3>
                    <p className="browse-authors">
                      {listing.authors.length > 0 ? listing.authors.join(', ') : 'Unknown author'}
                    </p>
                    <div className="browse-card-footer">
                      <span>{listing.conditionName}</span>
                      <span className="browse-status">{listing.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
      <SkylinePhotoCredit fixed />
    </div>
  );
};
