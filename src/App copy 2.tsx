// src/App.tsx
import React from 'react';
import RegistrationForm from './components/Registration_old/RegisterForm';
import AdminWelcomePage from './components/Products_old/AdminWelcomePage';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import { apolloClient } from './archives/apolloClient_old';
import { UserProvider } from './context/UserContext';
import ViewProfile from './components/Profile/ViewProfile';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Products_old/ProtectedRoute';
import Login from './components/new_Login/Login';
import SignUpHome from './components/new_Registration/SignUpHome';
import PhoneVerificationForm from './components/Registration_old/PhoneVerificationForm';
import ProtectedSignupRoute from './components/Registration_old/ProtectedSignupRoute';
import { VerificationProvider } from './context/VerificationContext';
import ProtectedForgotPasswordRoute from './components/Registration_old/ProtectedForgotPasswordRoute';
import ForgotPasswordForm from './components/Registration_old/ForgotPasswordForm';
import useApolloClient from './hooks/useApolloClient';
import { ApolloProvider } from '@apollo/client';
import Home from './components/Home';
import Orders from './components/Orders';
import Layout from './components/Layout';
import Banners from './components/Banners';
import PaymentDetails from './components/PaymentSettings';
import StoreSettings from './components/StoreSettings';
import OrderDetails from './components/Orders/OrderDetails';
import { Box, Typography } from '@mui/material';

function App() {
  return (
    <>
      <Box>
        <Typography>Hello World!</Typography>
      </Box>
    </>
  );
}

export default App;
