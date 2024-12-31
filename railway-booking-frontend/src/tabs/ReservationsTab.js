import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../styles/ReservationsTab.css";

const ReservationsTab = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState(""); // to store whether filtering by 'CustomerName' or 'TransitLine'
  const [filterValue, setFilterValue] = useState(""); // to store the input value for filtering

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async (filters = {}) => {
    try {
      const response = await axiosInstance.get("/admin/reservations", {
        params: filters,
      });
      setReservations(response.data.reservations);
      setError("");
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to fetch reservations.");
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Choose filter type
    if (filterType && filterValue) {
      fetchReservations({
        [filterType]: filterValue,
      });
    } else {
      fetchReservations(); // Fetch without filter if nothing is selected
    }
  };

  const handleClearFilter = () => {
    setFilterType(""); // Clear filter type
    setFilterValue(""); // Clear filter value
    fetchReservations(); // Fetch all reservations without filters
  };

  const deleteReservation = async (reservationId) => {
    try {
      await axiosInstance.delete(`/admin/reservations/${reservationId}`);
      setReservations(
        reservations.filter((r) => r.ReservationID !== reservationId)
      );
    } catch (err) {
      console.error("Error deleting reservation:", err);
      setError("Failed to delete reservation.");
    }
  };

  return (
    <div>
      <h2>Reservations</h2>
      {error && <p className="error">{error}</p>}

      {/* Filter Form */}
      <form onSubmit={handleFilterSubmit}>
        <div>
          <label>Filter By: </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Select Filter Type</option>
            <option value="customerName">Customer Name</option>
            <option value="transitLine">Transit Line</option>
          </select>
        </div>
        <div>
          <label>Filter Value: </label>
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <button type="submit">Apply Filter</button>
        <button
          type="button"
          onClick={handleClearFilter}
          style={{ marginLeft: "10px" }}
        >
          Clear Filter
        </button>
      </form>

      {/* Reservations Table */}
      <table>
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>Customer</th>
            <th>Transit Line</th>
            <th>Total Fare</th>
            <th>Trip Type</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.ReservationID}>
              <td>{reservation.ReservationID}</td>
              <td>
                {reservation.CustomerFirstName} {reservation.CustomerLastName}
              </td>
              <td>{reservation.TransitLine}</td>
              <td>${reservation.TotalFare.toFixed(2)}</td>
              <td>{reservation.TripType}</td>
              <td>{reservation.DepartureStation}</td>
              <td>{reservation.ArrivalStation}</td>
              <td>
                <button
                  onClick={() => deleteReservation(reservation.ReservationID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationsTab;
