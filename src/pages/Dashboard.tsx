import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import './Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();

  // Sample stats - these would come from your API
  const stats = [
    { icon: '📚', label: 'Books Listed', value: 12 },
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
            <button className="action-btn">
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
