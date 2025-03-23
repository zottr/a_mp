// src/VerificationContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface VerificationContextProps {
  isVerified: boolean;
  setVerified: (status: boolean) => void;
}

const VerificationContext = createContext<VerificationContextProps | undefined>(
  undefined
);

export const VerificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVerified, setVerified] = useState(false);

  return (
    <VerificationContext.Provider value={{ isVerified, setVerified }}>
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error(
      'useVerification must be used within a VerificationProvider'
    );
  }
  return context;
};
