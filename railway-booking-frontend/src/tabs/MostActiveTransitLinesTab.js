// src/tabs/MostActiveTransitLinesTab.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const MostActiveTransitLines = () => {
  const [transitLines, setTransitLines] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMostActiveTransitLines();
  }, []);

  const fetchMostActiveTransitLines = async () => {
    try {
      const response = await axiosInstance.get("/admin/most-active-transit-lines");
      setTransitLines(response.data.transitLines);
    } catch (err) {
      console.error("Error fetching most active transit lines:", err);
      setError("Failed to fetch most active transit lines.");
    }
  };

  return (
    <div>
      <h2>Most Active Transit Lines</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Transit Line</th>
            <th>Reservations Count</th>
          </tr>
        </thead>
        <tbody>
          {transitLines.map((line, index) => (
            <tr key={index}>
              <td>{line.TransitLine}</td>
              <td>{line.ReservationCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MostActiveTransitLines;
