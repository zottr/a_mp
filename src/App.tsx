// src/App.tsx
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ViewProfile from './components/Profile/ViewProfile';
import { useAuth } from './context/AuthContext';
import Login from './components/new_Login/Login';
import SignUpHome from './components/new_Registration/SignUpHome';
import { VerificationProvider } from './context/VerificationContext';
import useApolloClient from './hooks/useApolloClient';
import { ApolloProvider } from '@apollo/client';
import Home from './components/Home';
import Orders from './components/Orders';
import Layout from './components/Layout';
import Banners from './components/Banners';
import PaymentDetails from './components/PaymentSettings';
import StoreSettings from './components/StoreSettings';
import OrderDetails from './components/Orders/OrderDetails';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { authToken } = useAuth();

  return (
    <ApolloProvider client={useApolloClient()}>
      <BrowserRouter basename="/">
        <Layout>
          <Routes>
            {/* <Route
            path="/orders"
            element={
              <UserProvider>
                <OrdersList />
              </UserProvider>
            }
          /> */}
            <Route
              path="/login"
              element={authToken ? <Navigate replace to="/home" /> : <Login />}
            />
            <Route
              path="/signup"
              element={
                authToken ? <Navigate replace to="/home" /> : <SignUpHome />
              }
            />
            {/* <Route
              path="/signup-phone-verification"
              element={
                authToken ? (
                  <Navigate replace to="/home" />
                ) : (
                  <VerificationProvider>
                    <PhoneVerificationForm navigateUrl="/signupold" />
                  </VerificationProvider>
                )
              }
            /> */}
            {/* <Route
              path="/signupold"
              element={
                <VerificationProvider>
                  <ProtectedSignupRoute
                    element={<RegistrationForm logout={logout} />}
                  />
                </VerificationProvider>
              }
            /> */}
            {/* <Route
              path="/password-phone-verification"
              element={
                <VerificationProvider>
                  <PhoneVerificationForm navigateUrl="/forgot-password" />
                </VerificationProvider>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <VerificationProvider>
                  <ProtectedForgotPasswordRoute
                    element={<ForgotPasswordForm />}
                  />
                </VerificationProvider>
              }
            /> */}
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <Home />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <Orders />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/order/:orderId"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <OrderDetails />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/store-settings"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <StoreSettings />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/payment-settings"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <PaymentDetails />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/banners"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <Banners />
                    </UserProvider>
                  }
                />
              }
            />
            {/* <Route
              path="/add-new-item"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <AddOrUpdateItem />
                    </UserProvider>
                  }
                />
              }
            /> */}
            {/* <Route
              path="/homeold"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <AdminWelcomePage logout={logout} />
                    </UserProvider>
                  }
                />
              }
            /> */}
            <Route
              path="/viewProfile"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <ViewProfile />
                    </UserProvider>
                  }
                />
              }
            />
            {/* <Route path="*" element={<Navigate replace to="/login" />} /> */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
