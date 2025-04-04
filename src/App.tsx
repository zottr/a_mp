// src/App.tsx
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { useAuth } from './context/AuthContext';
import Login from './components/new_Login/Login';
import SignUpHome from './components/new_Registration/SignUpHome';
import useApolloClient from './hooks/useApolloClient';
import { ApolloProvider } from '@apollo/client';
import WelcomePage from './components/WelcomePage';
import Orders from './components/Orders';
import Layout from './components/Layout';
import PaymentDetails from './components/PaymentSettings';
import OrderDetails from './components/Orders/OrderDetails';
import ProtectedRoute from './components/common/ProtectedRoute';
import AccountCustomization from './components/AccountCustomization';
import AddNewItem from './components/CreateProduct/AddNewItem';
import UpdateItem from './components/CreateProduct/UpdateItem';
import ServicesHome from './components/ServicesDashboard/ServicesHome';
import AddNewService from './components/ServicesDashboard/CreateService/AddNewService';
import UpdateService from './components/ServicesDashboard/CreateService/UpdateService';
import AccountSettings from './components/AccountSettings';
import SellerHome from './components/SellerHome';

function App() {
  const { authToken } = useAuth();

  return (
    <ApolloProvider client={useApolloClient()}>
      <BrowserRouter basename="/">
        <Layout>
          <Routes>
            <Route
              path="/login"
              element={
                authToken ? <Navigate replace to="/welcome" /> : <Login />
              }
            />
            <Route
              path="/signup"
              element={
                authToken ? <Navigate replace to="/welcome" /> : <SignUpHome />
              }
            />
            <Route path="/" element={<Navigate replace to="/welcome" />} />
            <Route
              path="/welcome"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <WelcomePage />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/seller"
              element={<Navigate replace to="/seller/home" />}
            />
            <Route
              path="/seller/home"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <SellerHome />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/services"
              element={<Navigate replace to="/services/home" />}
            />
            <Route
              path="/services/home"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <ServicesHome />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/services/settings"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <AccountSettings type="services" />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/services/customize"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <AccountCustomization type="services" />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/seller/orders"
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
              path="/product/:productId"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <UpdateItem />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/service/:serviceId"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <UpdateService />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/seller/add-new-product"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <AddNewItem />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/services/add-new-service"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <AddNewService />
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
              path="/seller/settings"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <AccountSettings type="seller" />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/seller/customize"
              element={
                <ProtectedRoute
                  element={
                    <UserProvider>
                      <AccountCustomization type="seller" />
                    </UserProvider>
                  }
                />
              }
            />
            <Route
              path="/seller/payment-settings"
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
            <Route path="*" element={<Navigate replace to="/login" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
