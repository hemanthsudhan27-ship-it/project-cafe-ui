'use client';

import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthAction, User } from '@/lib/types/auth';

interface AuthContextValue extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  setLoading: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cafe-ui:user');
      if (saved) {
        const user: User = JSON.parse(saved);
        dispatch({ type: 'LOGIN', payload: user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Persist user changes to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('cafe-ui:user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('cafe-ui:user');
    }
  }, [state.user]);

  const login = (user: User) => dispatch({ type: 'LOGIN', payload: user });
  const logout = () => dispatch({ type: 'LOGOUT' });
  const updateUser = (updates: Partial<User>) => dispatch({ type: 'UPDATE_USER', payload: updates });
  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

