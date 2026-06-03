import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterFormData, FormErrors } from '../types/auth';
import './RegisterModal.css';

interface RegisterModalProps {
  onClose: () => void;
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    displayName: '',
    age: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 10) {
      newErrors.password = 'Password must be at least 10 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Username is required';
    } else if (formData.displayName.length < 3) {
      newErrors.displayName = 'Username must be at least 3 characters';
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 13) {
      newErrors.age = 'You must be at least 13 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5277';
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccessMessage('Account created successfully! Logging you in...');
      
      // Auto-login after successful registration
      setTimeout(async () => {
        try {
          await login({ email: formData.email, password: formData.password });
          onRegisterSuccess();
          navigate('/dashboard');
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          setErrors({ general: 'Account created but login failed. Please try logging in manually.' });
        }
      }, 1500);

    } catch (error: any) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content register-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Create Your Account</h2>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="displayName">Username *</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              disabled={loading}
              className={errors.displayName ? 'error' : ''}
              placeholder="This will be visible to other users"
            />
            {errors.displayName && <span className="field-error">{errors.displayName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={errors.email ? 'error' : ''}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled={loading}
                className={errors.age ? 'error' : ''}
                min="13"
              />
              {errors.age && <span className="field-error">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={loading}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={errors.password ? 'error' : ''}
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
            <small>Minimum 10 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className={errors.confirmPassword ? 'error' : ''}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="modal-footer">
          <p>Already have an account? <button type="button" onClick={onSwitchToLogin} className="link-button">Login</button></p>
        </div>
      </div>
    </div>
  );
};
