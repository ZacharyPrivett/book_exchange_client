import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
import LoginModal from './LoginModal';
import { RegisterModal } from './RegisterModal';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    navigate('/dashboard');
  };

  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false);
    navigate('/dashboard');
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
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
                <li><a href="#books">Books</a></li>
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
              <button onClick={() => setIsLoginOpen(true)} className="btn-login">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
        />
      )}

      {isRegisterOpen && (
        <RegisterModal 
          onClose={() => setIsRegisterOpen(false)}
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </>
  );
};

export default Navbar;
