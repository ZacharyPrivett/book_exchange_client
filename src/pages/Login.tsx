import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { GoogleIcon, MicrosoftIcon } from '../components/BrandIcons';
import './Auth.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Already logged in? No need to show the login page.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({ email, password, rememberMe });
      navigate('/dashboard');
    } catch (err: unknown) {
      let errorMessage = 'Login failed. Please check your credentials.';

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      setError(errorMessage);
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
    <AuthLayout>
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to continue trading books.</p>

        <div className="auth-oauth-group">
          <button
            type="button"
            className="auth-oauth-btn"
            onClick={() => handleOAuthLogin('Google')}
            disabled={isLoading}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <button
            type="button"
            className="auth-oauth-btn"
            onClick={() => handleOAuthLogin('Microsoft')}
            disabled={isLoading}
          >
            <MicrosoftIcon />
            Continue with Microsoft
          </button>
        </div>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          <div className="auth-field">
            <div className="auth-field-row">
              <label htmlFor="password">Password</label>
              <a href="#forgot-password" className="auth-inline-link">
                Forgot password?
              </a>
            </div>
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

          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            Remember me
          </label>

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
