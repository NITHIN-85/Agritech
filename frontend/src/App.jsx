import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';

import Login from './pages/Login';
import Register from './pages/Register';
import YieldTracking from './pages/YieldTracking';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import OrderTracking from './pages/OrderTracking';
import AgriSync from './pages/AgriSync';
import AIAnalytics from './pages/AIAnalytics';


import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        
        <Route path="/harvest" element={
          <ProtectedRoute role="FARMER">
            <YieldTracking />
          </ProtectedRoute>
        } />
        
        <Route path="/farmer-dashboard" element={
          <ProtectedRoute role="FARMER">
            <FarmerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/buyer-dashboard" element={
          <ProtectedRoute role="BUYER">
            <BuyerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/track/:orderId" element={
          <ProtectedRoute role="BUYER">
            <OrderTracking />
          </ProtectedRoute>
        } />
        <Route path="/agrisync" element={
          <ProtectedRoute>
            <AgriSync />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute role="FARMER">
            <AIAnalytics />
          </ProtectedRoute>
        } />

      </Routes>

    </Router>
  );
}

export default App;
