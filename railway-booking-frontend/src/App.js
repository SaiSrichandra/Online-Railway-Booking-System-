import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import AdminDashboard from "./pages/AdminDashboard";
import RepresentativeDashboard from "./pages/RepresentativeDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import LogoutButton from "./components/LogoutButton";
import Signup from "./pages/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const checkRole = () => setRole(localStorage.getItem("role"));
    window.addEventListener("storage", checkRole); // Listen for storage changes
    return () => window.removeEventListener("storage", checkRole);
  }, []);

  return (
    <Router>
      {role && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ flex: 1, textAlign: "center", color: "#333" }}>
            Railway Reservation System
          </h1>
          <LogoutButton
            onLogout={() => setRole(null)}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          />
        </div>
      )}{" "}
      {/* Logout Button */}
      <Routes>
        {/* Main Page */}
        <Route path="/" element={<MainPage />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Role-Based Routes */}
        {role === "admin" && (
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        )}
        {role === "staff" && (
          <Route
            path="/representative-dashboard"
            element={<RepresentativeDashboard />}
          />
        )}
        {role === "customer" && (
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
