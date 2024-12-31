import React, { useState } from "react";
import { Link } from "react-router-dom";
import ManageSchedules from "../tabs/ManageSchedulesTab";
import ReplyQuestions from "../tabs/ReplyQuestionsTab";
import ViewCustomers from "../tabs/ViewCustomersTab";

const RepresentativeDashboard = () => {
  const [activeTab, setActiveTab] = useState("schedules");

  // Render the content of the selected tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "schedules":
        return <ManageSchedules />;
      case "questions":
        return <ReplyQuestions />;
      case "customers":
        return <ViewCustomers />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Customer Representative Dashboard</h1>

      {/* Tabs */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setActiveTab("schedules")}
          style={{
            background: activeTab === "schedules" ? "blue" : "lightgray",
            color: activeTab === "schedules" ? "white" : "black",
            margin: "0 5px",
            padding: "10px",
          }}
        >
          Manage Schedules
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          style={{
            background: activeTab === "questions" ? "blue" : "lightgray",
            color: activeTab === "questions" ? "white" : "black",
            margin: "0 5px",
            padding: "10px",
          }}
        >
          Reply Questions
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          style={{
            background: activeTab === "customers" ? "blue" : "lightgray",
            color: activeTab === "customers" ? "white" : "black",
            margin: "0 5px",
            padding: "10px",
          }}
        >
          View Customers
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: "20px" }}>{renderTabContent()}</div>
    </div>
  );
};

export default RepresentativeDashboard;
