import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterFormData, FormErrors } from '../types/auth';
import { AuthLayout } from '../components/AuthLayout';
import './Auth.css';

export const Signup = () => {
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

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Already logged in? No need to show the signup page.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

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
    } else if (parseInt(formData.age) < 18) {
      newErrors.age = 'You must be at least 18 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        age: formData.age,
        phoneNumber: formData.phoneNumber || undefined,
      });

      setSuccessMessage('Account created successfully! Redirecting to dashboard...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start trading books with your community.</p>

        {successMessage && <div className="auth-success">{successMessage}</div>}
        {errors.general && <div className="auth-error">{errors.general}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field-grid">
            <div className="auth-field">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                className={errors.firstName ? 'auth-input-error' : ''}
              />
              {errors.firstName && <span className="auth-field-error">{errors.firstName}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                className={errors.lastName ? 'auth-input-error' : ''}
              />
              {errors.lastName && <span className="auth-field-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="displayName">Username *</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              disabled={loading}
              className={errors.displayName ? 'auth-input-error' : ''}
              placeholder="This will be visible to other users"
            />
            {errors.displayName && <span className="auth-field-error">{errors.displayName}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={errors.email ? 'auth-input-error' : ''}
              autoComplete="email"
            />
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          <div className="auth-field-grid">
            <div className="auth-field">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled={loading}
                className={errors.age ? 'auth-input-error' : ''}
                min="13"
              />
              {errors.age && <span className="auth-field-error">{errors.age}</span>}
            </div>

            <div className="auth-field">
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

          <div className="auth-field">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={errors.password ? 'auth-input-error' : ''}
              autoComplete="new-password"
            />
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
            <small>Minimum 10 characters</small>
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className={errors.confirmPassword ? 'auth-input-error' : ''}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
