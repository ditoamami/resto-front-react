import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/dashboard/DashboardPage';
import LoginPage from '../pages/auth/LoginPage';
import MenuListPage from '../pages/menu/MenuListPage';
import OrderListPage from '../pages/order/OrderListPage';
import PaymentPage from '../pages/payment/PaymentPage';
import NotFound from '../pages/notfound/NotFound';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { Box } from '@mui/material';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const { user } = useContext(AuthContext);

  return (
    <Box sx={{ display: 'flex' }}>
      {user && <Sidebar />}

      <Box component="main" sx={{ flex: 1 }}>
        <Header />

        <Box sx={{ p: 3 }}>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* PROTECTED */}
            <Route
              path="/menus"
              element={
                <PrivateRoute>
                  <MenuListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrderListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <PrivateRoute>
                  <PaymentPage />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
