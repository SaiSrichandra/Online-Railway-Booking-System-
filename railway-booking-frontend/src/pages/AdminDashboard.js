import React, { useState } from "react";
import { Link } from "react-router-dom";
import SalesReport from "../tabs/SalesReportTab"; // Import SalesReport component
import Reservations from "../tabs/ReservationsTab"; // Import Reservations component
import RevenueTab from "../tabs/RevenueTab"; // Import RevenueTab component
import MostActiveTransitLines from "../tabs/MostActiveTransitLinesTab"; // Import MostActiveTransitLines component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("sales");

  // Render tab content dynamically
  const renderTabContent = () => {
    switch (activeTab) {
      case "sales":
        return <SalesReport />; // Render the SalesReport component
      case "reservations":
        return <Reservations />; // Render the Reservations component
      case "revenue":
        return <RevenueTab />; // Render the Revenue component
      case "most-active-transit":
        return <MostActiveTransitLines />; // Render the Most Active Transit Lines component
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Manage Employees Link */}
      <Link
        to="/admin/manage-representatives"
        style={{
          color: "purple",
          textDecoration: "none",
          fontWeight: "bold",
          marginBottom: "20px",
          display: "inline-block",
        }}
      >
        Manage Employees
      </Link>

      {/* Tabs */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setActiveTab("sales")}
          style={{
            background: activeTab === "sales" ? "blue" : "lightgray",
            color: activeTab === "sales" ? "white" : "black",
            margin: "0 5px",
            padding: "10px",
          }}
        >
          Sales Report
        </button>
        <button
          onClick={() => setActiveTab("reservations")}
          style={{
            background: activeTab === "reservations" ? "blue" : "lightgray",
            color: activeTab === "reservations" ? "white" : "black",
            margin: "0 5px",
            padding: "10px",
          }}
        >
          Reservations
        </button>
        <button
          onClick={() => setActiveTab("revenue")}
          style={{
            background: activeTab === "revenue" ? "blue" : "lightgray",
            color: activeTab === "revenue" ? "white" : "black",
            margin: "0 5px",
            padding: "10px",
          }}
        >
          Revenue
        </button>
        <button
          onClick={() => setActiveTab("most-active-transit")}
          style={{
            background:
              activeTab === "most-active-transit" ? "blue" : "lightgray",
            color: activeTab === "most-active-transit" ? "white" : "black",
            margin: "0 5px",
            padding: "10px",
          }}
        >
          Most Active Transit Lines
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: "20px" }}>{renderTabContent()}</div>
    </div>
  );
};

export default AdminDashboard;
