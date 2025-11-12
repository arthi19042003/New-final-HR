import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HiringManagerDashboard from './pages/HiringManagerDashboard';
import ResumeDetailPage from './pages/ResumeDetailPage';
import OpenPositions from './pages/OpenPositions'; // ✅ Added
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CreatePurchaseOrder from "./pages/CreatePurchaseOrder";
import ViewPurchaseOrders from "./pages/ViewPurchaseOrders";
import ApplicationsDashboard from "./pages/ApplicationsDashboard";
import OnboardingDashboard from "./pages/OnboardingDashboard";
import AgencyInvites from "./pages/AgencyInvites";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";


<Route
  path="/purchase-orders"
  element={
    <ProtectedRoute>
      <ViewPurchaseOrders />
    </ProtectedRoute>
  }
/>

import { Toaster } from 'react-hot-toast';

// 404 fallback
const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>404 – Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Global toaster notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Main content */}
      <main className="p-6">
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Hiring Manager Dashboard */}
          <Route
            path="/dashboard/hiring-manager"
            element={
              <ProtectedRoute>
                <HiringManagerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Open Positions Page */}
          <Route
            path="/positions"
            element={
              <ProtectedRoute>
                <OpenPositions />
              </ProtectedRoute>
            }
          />

          {/* Resume Detail Page */}
          <Route
            path="/dashboard/hiring-manager/resume/:id"
            element={
              <ProtectedRoute>
                <ResumeDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <ProtectedRoute>
                <ViewPurchaseOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-po"
            element={
              <ProtectedRoute>
                <CreatePurchaseOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications-dashboard"
            element={
              <ProtectedRoute>
                <ApplicationsDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/inbox"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingDashboard />
              </ProtectedRoute>}
          />
          <Route
            path="/agency-invites"
            element={
              <ProtectedRoute>
                <AgencyInvites />
              </ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>}
          />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
