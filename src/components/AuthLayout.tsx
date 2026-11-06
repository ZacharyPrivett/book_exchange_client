import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SkylinePhotoCredit } from './SkylinePhotoCredit';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="auth-page">
      <div className="auth-brand-panel">
        <Link to="/" className="auth-brand-logo">
          {/* <span className="auth-brand-emoji">📚</span> */}
          <span>Queen City Book Trader</span>
        </Link>

        <div className="auth-brand-copy">
          <h1>Give your books a second story.</h1>
          <p>Join a community of local readers swapping books across the Queen City.</p>
        </div>

        {/* <div className="auth-brand-float" aria-hidden="true">
          <div className="auth-float-book auth-float-1">📖</div>
          <div className="auth-float-book auth-float-2">📚</div>
          <div className="auth-float-book auth-float-3">📕</div>
        </div> */}

        <SkylinePhotoCredit />
      </div>

      <div className="auth-form-panel">
        <Link to="/" className="auth-mobile-logo">
          📚 QC Book Trader
        </Link>
        <div className="auth-form-wrapper">{children}</div>
      </div>
    </div>
  );
};
