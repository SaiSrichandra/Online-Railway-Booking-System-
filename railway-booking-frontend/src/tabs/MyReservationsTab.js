// MyReservationsTab.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

import "../styles/MyReservationsTab.css"; // Import CSS file

const MyReservationsTab = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  // Fetch all reservations made by the customer
  const fetchReservations = async () => {
    const customerId = localStorage.getItem("customerId"); // Retrieve from localStorage

    if (!customerId) {
      setError("Customer ID not found. Please log in again.");
      return;
    }

    try {
      const response = await axiosInstance.get("/customer/reservations", {
        params: { customerId },
      });

      if (response.data.reservations.length === 0) {
        setError("No reservations found.");
      } else {
        setReservations(response.data.reservations);
        setError("");
      }
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to fetch reservations.");
    }
  };

  // Cancel a reservation
  const handleCancelReservation = async (reservationId) => {
    try {
      await axiosInstance.delete(`/customer/reservations/${reservationId}`);
      setReservations(
        reservations.filter(
          (reservation) => reservation.ReservationID !== reservationId
        )
      );
      setError("");
    } catch (err) {
      console.error("Error canceling reservation:", err);
      setError("Failed to cancel reservation.");
    }
  };
  const formatDateTime = (dateString) => {
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  return (
    <div>
      <h3>My Reservations</h3>
      {error && <p className="error">{error}</p>}

      {reservations.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Train ID</th>
              <th>Origin Station</th>
              <th>Destination Station</th>
              <th>Departure Date</th>
              <th>Arrival Date</th>
              <th>Trip Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.ReservationID}>
                <td>{reservation.ReservationID}</td>
                <td>{reservation.TrainID}</td>
                <td>{reservation.DepartureStation}</td>
                <td>{reservation.ArrivalStation}</td>
                <td>{formatDateTime(reservation.DepartureDateTime)}</td>
                <td>{formatDateTime(reservation.ArrivalDateTime)}</td>
                <td>{reservation.IsRoundTrip ? "Return" : "One Way"}</td>
                <td>
                  <button
                    onClick={() =>
                      handleCancelReservation(reservation.ReservationID)
                    }
                  >
                    Cancel Reservation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyReservationsTab;
