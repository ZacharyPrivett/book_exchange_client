export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
    email: string;
    displayName: string;
    roles: string[];
}

export interface User {
    userId: string;
    email: string;
    displayName: string;
    roles: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
  age: string;
  phoneNumber?: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  displayName: string;
  age: string;
  phoneNumber: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  age?: string;
  general?: string;
}