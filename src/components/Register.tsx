import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterFormData, FormErrors } from '../types/auth'
import './Register.css';


export const Register: React.FC = () => {
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

  const { login } = useAuth()
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
      newErrors.displayName = 'Display name is required';
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 13) {
      newErrors.age = 'Must be at least 13 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName,
          age: formData.age,
          phoneNumber: formData.phoneNumber || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      setSuccessMessage('Registration successful! Please check your email to confirm your account.');
      
      // Auto-login after successful registration
      await login({ 
        email: formData.email, 
        password: formData.password 
      });
      
      navigate('/dashboard'); // Or wherever you want them to go

    } catch (err: any) {
      setErrors({
        general: err.message || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create Your Account</h2>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

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

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <div className="links">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
};