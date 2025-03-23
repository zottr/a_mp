import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Administrator } from '../libs/graphql/generated-types';
import { useLazyQuery } from '@apollo/client';
import { GET_ACTIVE_ADMINISTRATOR } from '../libs/graphql/definitions/administrator-definitions';

export interface UserContextType {
  adminUser: Administrator | null;
  setAdminUser: React.Dispatch<React.SetStateAction<Administrator | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Administrator | null>(null);

  const [fetchActiveAdmin] = useLazyQuery(GET_ACTIVE_ADMINISTRATOR);

  useEffect(() => {
    async function fetchUser() {
      try {
        const result = await fetchActiveAdmin();
        setUser(result.data.activeAdministrator);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    }

    fetchUser();
  }, [fetchActiveAdmin]);

  return (
    <UserContext.Provider value={{ adminUser: user, setAdminUser: setUser }}>
      {children}
    </UserContext.Provider>
  );
};
