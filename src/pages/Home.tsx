import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { RegisterModal } from '../components/RegisterModal';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home">
      <Navbar />
      
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            📚 Welcome to QC Book Trader
          </h1>
          <p className="hero-subtitle">
            Exchange books with fellow readers in the Queen City community
          </p>
          <button className="cta-button" onClick={handleGetStarted}>
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </button>
        </div>
        <div className="hero-image">
          <div className="book-stack">
            <div className="book book-1">📖</div>
            <div className="book book-2">📚</div>
            <div className="book book-3">📕</div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Why Choose QC Book Trader?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Easy Exchanges</h3>
            <p>Simple and secure book trading with local readers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Local Community</h3>
            <p>Connect with book lovers in the Queen City area</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Save Money</h3>
            <p>Get the books you want without breaking the bank</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Eco-Friendly</h3>
            <p>Reduce waste by giving books a second life</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>List Your Books</h3>
            <p>Add books you're willing to exchange to your collection</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Browse & Match</h3>
            <p>Find books you want from other members' collections</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Exchange</h3>
            <p>Connect with members and arrange your book swap</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Trading?</h2>
        <p>Join our community of book lovers today!</p>
        <button className="cta-button-secondary" onClick={handleGetStarted}>
          {isAuthenticated ? 'Browse Books' : 'Sign Up Now'}
        </button>
      </section>

      <footer className="footer">
        <p>&copy; 2026 QC Book Trader. All rights reserved.</p>
      </footer>
    </div>
  );
};
