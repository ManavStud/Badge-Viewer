import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      const username = localStorage.getItem("username");
      
      if (!username) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:5000/check-admin?username=${username}`);
        setIsAdmin(response.data.isAdmin);
        
        // Update local storage
        localStorage.setItem("isAdmin", response.data.isAdmin.toString());
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verifying access...</p>
      </div>
    );
  }
  
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default AdminRoute;