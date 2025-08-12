import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BloodRequestsPublic from './pages/BloodRequestsPublic';
import AboutPage from './pages/AboutPage';
import FindDonorsPage from './pages/FindDonorsPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App baloo-bhaijaan-2-custom">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/blood-requests" element={<BloodRequestsPublic />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/find-donors" element={<FindDonorsPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect any unknown route to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;