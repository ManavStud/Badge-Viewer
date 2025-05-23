import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage";
import LoginPage from "./components/LoginPage";
import AdminLogin from "./components/AdminLogin"; // Add this
import AllBadgesPage from "./components/AllBadgesPage";
import ProfilePage from "./components/ProfilePage";
import BadgeAdminPage from "./components/BadgeAdminPage";
import AdminRoute from "./components/AdminRoute"; // Add this
import HolographicBadgeDisplay from "./components/HolographicBadgeDisplay";
import NewBadgeView from './components/NewBadgeView';
import SharedBadgePage from "./components/SharedBadgePage";
import { AuthProvider } from "./context/AuthContext";
// Protected Route for Profile
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLogin />} /> {/* Add admin login route */}
        <Route path="/badges" element={<AllBadgesPage />} />
        <Route path="/badge-view/:id?" element={<HolographicBadgeDisplay />} />
        <Route path="/new-badge/:id?" element={<NewBadgeView />} />
        <Route path="/badge/shared/:id/:username/:timestamp" element={<SharedBadgePage />} />
        <Route path="/holo" element={<HolographicBadgeDisplay />} />
        <Route path="/learn-more" element={<HolographicBadgeDisplay />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Use AdminRoute for admin pages */}
        <Route 
          path="/admin/badges" 
          element={
            <AdminRoute>
              <BadgeAdminPage />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
