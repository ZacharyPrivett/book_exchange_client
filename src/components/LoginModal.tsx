import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './LoginModal.css';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal = ({ onClose, onLoginSuccess, onSwitchToRegister }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({ email, password, rememberMe });
      onLoginSuccess();
      console.log('Login successful!');
    } catch (err: any) {
        let errorMessage = 'Login failed. Please check your credentials.';
  
        if (err.response?.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (err.response?.data?.message) {
        // For other errors (500, 400, etc.), use backend message if available
        errorMessage = err.response.data.message;
        }

        setError(errorMessage);
        console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'Google' | 'Microsoft') => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:7253';
    const returnUrl = encodeURIComponent(window.location.origin);
  
    // Redirect to backend OAuth endpoint
    window.location.href = `${apiUrl}/auth/external-login/${provider}?returnUrl=${returnUrl}`;
};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              Remember me
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button 
          type="button"
          className="btn-oauth btn-google"
          onClick={() => handleOAuthLogin('Google')}
          disabled={isLoading}
        >
          <span>Continue with Google</span>
        </button>

        <button 
          type="button"
          className="btn-oauth btn-microsoft"
          onClick={() => handleOAuthLogin('Microsoft')}
          disabled={isLoading}
        >
          <span>Continue with Microsoft</span>
        </button>

        <div className="modal-footer">
          <a href="#forgot-password">Forgot password?</a>
          <p>Don't have an account? <button type="button" onClick={onSwitchToRegister} className="link-button">Sign up</button></p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
