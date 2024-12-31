import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend);

const SalesReport = () => {
  const [month, setMonth] = useState(""); // Selected month
  const [revenueData, setRevenueData] = useState([]); // Revenue data
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch revenue data when the month changes
    const fetchRevenue = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/sales-report?month=${month || "all"}`
        );
        setRevenueData(response.data || []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch revenue data.");
      }
    };

    fetchRevenue();
  }, [month]);

  return (
    <div>
      <h2>Sales Report</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Dropdown for selecting month */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="month">Select Month: </label>
        <select
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">All Months</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      {/* Display revenue data */}
      {revenueData.length > 0 ? (
        <Line
          data={{
            labels: revenueData.map((data) => data.month), // Example: ['January', 'February']
            datasets: [
              {
                label: "Revenue ($)",
                data: revenueData.map((data) => data.revenue), // Example: [1000, 2000]
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                fill: true,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Monthly Revenue",
              },
              legend: {
                display: true,
                position: "top",
              },
            },
            scales: {
              x: {
                type: "category", // Explicitly set the X-axis scale type
                title: { display: true, text: "Month" },
              },
              y: {
                type: "linear", // Explicitly set the Y-axis scale type
                title: { display: true, text: "Revenue ($)" },
              },
            },
          }}
        />
      ) : (
        <p>No revenue data available for the selected month(s).</p>
      )}
    </div>
  );
};

export default SalesReport;
