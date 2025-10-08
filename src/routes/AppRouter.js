import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/dashboard/DashboardPage';
import LoginPage from '../pages/auth/LoginPage';
import MenuListPage from '../pages/menu/MenuListPage';
import OrderListPage from '../pages/order/OrderListPage';
import PaymentPage from '../pages/payment/PaymentPage';
import NotFound from '../pages/notfound/NotFound';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import { AuthProvider } from '../context/AuthContext';
import { Box } from '@mui/material';

export default function AppRouter(){
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Box sx={{ display:'flex' }}>
          <Sidebar />
          <Box component="main" sx={{ flex:1, p:3 }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<DashboardPage />} />
              <Route path="/menus" element={<MenuListPage />} />
              <Route path="/orders" element={<OrderListPage />} />
              <Route path="/payments" element={<PaymentPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      </AuthProvider>
    </BrowserRouter>
  );
}
