import { useState } from 'react';
import './Navbar.css';
import LoginModal from './LoginModal';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('token'); // Clear any stored token
  };

  const handleLoginSuccess = (user: string, token: string) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem('token', token);
    setIsLoginOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h2>📚 QC Book Trader</h2>
          </div>
          
          <ul className="navbar-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#books">Books</a></li>
            <li><a href="#exchange">Exchange</a></li>
            <li><a href="#about">About</a></li>
          </ul>

          <div className="navbar-auth">
            {isLoggedIn ? (
              <div className="user-info">
                <span>Welcome, {username}!</span>
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
        />
      )}
    </>
  );
};

export default Navbar;
