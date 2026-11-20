import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>📚 QC Book Trader</h2>
          </Link>
        </div>

        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/books">Books</Link></li>
              <li><a href="#exchange">Exchange</a></li>
            </>
          )}
        </ul>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-info">
              <span>Welcome, {user?.displayName}!</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/signup" className="btn-signup">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
