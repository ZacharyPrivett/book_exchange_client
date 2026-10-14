import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { bookService } from '../services/bookService';
import type { ListingSummary } from '../types/book';
import './Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState('');

  useEffect(() => {
    bookService
      .getMyListings()
      .then(setListings)
      .catch(() => setListingsError('Could not load your library. Please try again later.'))
      .finally(() => setListingsLoading(false));
  }, []);

  const stats = [
    { icon: '📚', label: 'Books Listed', value: listings.length },
    { icon: '🔄', label: 'Exchanges Made', value: 8 },
    { icon: '👥', label: 'Active Connections', value: 24 },
    { icon: '⭐', label: 'Rating', value: '4.8' },
  ];

  // Sample recent activity - would come from your API
  const recentActivity = [
    { icon: '✅', text: 'Successfully exchanged "The Great Gatsby"', time: '2 hours ago' },
    { icon: '📖', text: 'Listed "To Kill a Mockingbird" for exchange', time: '5 hours ago' },
    { icon: '💬', text: 'Received a message about "1984"', time: '1 day ago' },
    { icon: '🔔', text: 'New match found for your wishlist', time: '2 days ago' },
  ];

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <section className="welcome-section">
          <h1>Welcome back, {user?.displayName || 'Book Trader'}! 👋</h1>
          <p>Ready to trade some books today?</p>
        </section>

        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-card-icon">{stat.icon}</div>
              <h3>{stat.label}</h3>
              <p className="stat-card-value">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => navigate('/books/add')}>
              <span className="action-btn-icon">➕</span>
              List a Book
            </button>
            <button className="action-btn">
              <span className="action-btn-icon">🔍</span>
              Browse Books
            </button>
            <button className="action-btn">
              <span className="action-btn-icon">💬</span>
              Messages
            </button>
            <button className="action-btn">
              <span className="action-btn-icon">⚙️</span>
              Settings
            </button>
          </div>
        </section>

        <section className="library-section">
          <div className="section-heading">
            <div>
              <h2>Your Library</h2>
              <p>Books you have added and made available for exchange.</p>
            </div>
            <button className="library-action" onClick={() => navigate('/books/add')}>
              Add a Book
            </button>
          </div>

          {listingsLoading && <p className="library-message">Loading your books...</p>}
          {!listingsLoading && listingsError && <p className="library-message library-error">{listingsError}</p>}
          {!listingsLoading && !listingsError && listings.length === 0 && (
            <div className="library-empty">
              <span className="library-empty-icon">📚</span>
              <p>Your library is empty.</p>
              <button className="library-action" onClick={() => navigate('/books/add')}>
                Add your first book
              </button>
            </div>
          )}
          {!listingsLoading && !listingsError && listings.length > 0 && (
            <div className="library-grid">
              {listings.map((listing) => (
                <article key={listing.id} className="library-card">
                  <div className="library-cover">
                    {listing.coverImageUrl ? (
                      <img src={listing.coverImageUrl} alt={`Cover of ${listing.title}`} />
                    ) : (
                      <span>📖</span>
                    )}
                  </div>
                  <div className="library-card-content">
                    <h3>{listing.title}</h3>
                    <p className="library-authors">
                      {listing.authors.length > 0 ? listing.authors.join(', ') : 'Unknown author'}
                    </p>
                    <div className="library-card-footer">
                      <span>{listing.conditionName}</span>
                      <span className="listing-status">{listing.status}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="recent-activity">
          <h2>Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <ul className="activity-list">
              {recentActivity.map((activity, index) => (
                <li key={index} className="activity-item">
                  <span className="activity-icon">{activity.icon}</span>
                  <div className="activity-content">
                    <p className="activity-text">{activity.text}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-activity">No recent activity</p>
          )}
        </section>
      </div>
    </div>
  );
};
