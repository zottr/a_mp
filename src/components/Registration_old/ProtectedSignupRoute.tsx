// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedSignupRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isVerified } = useVerification();
  return isVerified ? (
    <>{element}</>
  ) : (
    <Navigate replace to="/phone-verification" />
  );
};

export default ProtectedSignupRoute;
