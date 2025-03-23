import React, { createContext, useState, ReactNode, useContext } from 'react';
import { isLocalStorageAvailable } from '../utils/CommonUtils';

export interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string) => void;
  unsetAuthToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'zottrAdminAuthToken';
const storageAvailable = isLocalStorageAvailable();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    // Initialize authToken from localStorage if available
    if (storageAvailable) return localStorage.getItem('zottrAdminAuthToken');
    else return null;
  });
  return (
    <AuthContext.Provider
      value={{
        authToken: token,
        setAuthToken: (token: string) => {
          if (storageAvailable) {
            localStorage.setItem(AUTH_TOKEN_KEY, token);
          }
          setToken(token);
        },
        unsetAuthToken: () => {
          if (storageAvailable) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
          }
          setToken(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
