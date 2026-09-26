import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const errorParam = searchParams.get('error');

      console.log('OAuth Callback - Received params:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        error: errorParam,
        fullURL: window.location.href  // See the full URL
      });

      if (errorParam) {
        setError(getErrorMessage(errorParam));
        setTimeout(() => navigate('/'), 15000);
        return;
      }

      if (accessToken && refreshToken) {
        try {
          console.log('Calling handleOAuthCallback...');
          await handleOAuthCallback(accessToken, refreshToken);
          console.log('OAuth callback successful!');
          navigate('/dashboard');
        } catch (err) {
          console.error('OAuth callback failed:', err);
          setError('Failed to complete login. Please try again.');
          setTimeout(() => navigate('/'), 3000);
        }
      } else {
        setError('Invalid authentication response.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, handleOAuthCallback]);

  const getErrorMessage = (error: string): string => {
    const errorMessages: Record<string, string> = {
      external_auth_failed: 'External authentication failed',
      no_email: 'Email not provided by authentication provider',
      user_creation_failed: 'Failed to create user account',
    };
    return errorMessages[error] || 'Authentication failed';
  };

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Completing login...</h2>
      <p>Please wait while we finish setting up your account.</p>
    </div>
  );
};

export default OAuthCallback;