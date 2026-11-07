export type UserRole = 'student' | 'faculty' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  teacherId?: string; // Faculty only
  avatar?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface OtpLoginPayload {
  email: string;
  otp: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  department?: string;
  teacherId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

