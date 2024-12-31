import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const TravelItineraryTab = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomerReservations();
  }, []);

  // Fetch all reservations for the logged-in customer
  // const fetchCustomerReservations = async () => {
  //   try {
  //     const response = await axiosInstance.get("/customer/reservations");
  //     setReservations(response.data.reservations);
  //     if (response.data.reservations.length === 0) {
  //       setError("No reservations found.");
  //     } else {
  //       setError("");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching reservations:", err);
  //     setError("Failed to fetch reservations.");
  //   }
  // };
  const fetchCustomerReservations = async () => {
    const customerId = localStorage.getItem("customerId"); // Retrieve customerId from localStorage

    if (!customerId) {
      setError("Customer ID not found. Please log in again.");
      return;
    }

    try {
      const response = await axiosInstance.get("/customer/reservations", {
        params: { customerId }, // Explicitly send customerId
      });
      setReservations(response.data.reservations);
      if (response.data.reservations.length === 0) {
        setError("No reservations found.");
      } else {
        setError("");
      }
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to fetch reservations.");
    }
  };

  // Fetch itinerary for the selected reservation
  const handleFetchItinerary = async () => {
    if (!selectedReservation) {
      setError("Please select a reservation.");
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/customer/reservations/itinerary/${selectedReservation}`
      );
      setItinerary(response.data.itinerary);
      setError("");
    } catch (err) {
      console.error("Error fetching itinerary:", err);
      setError("Failed to fetch itinerary. Please try again.");
      setItinerary(null);
    }
  };

  const buttonStyle = {
    padding: "5px 10px",
    fontSize: "12px",
    margin: "10px",
  };

  return (
    <div>
      <h3>View Travel Itinerary</h3>

      {/* Dropdown for selecting reservation */}
      <div>
        <label>Select a Reservation:</label>
        <select
          value={selectedReservation}
          onChange={(e) => setSelectedReservation(e.target.value)}
        >
          <option value="">-- Select Reservation --</option>
          {reservations.map((reservation) => (
            <option
              key={reservation.ReservationID}
              value={reservation.ReservationID}
            >
              {`Reservation ${reservation.ReservationID} - ${reservation.DepartureStation} to ${reservation.ArrivalStation}`}
            </option>
          ))}
        </select>
        <button style={buttonStyle} onClick={handleFetchItinerary}>
          View Itinerary
        </button>
      </div>

      {/* Error message */}
      {error && <p className="error">{error}</p>}

      {/* Display travel itinerary */}
      {itinerary && (
        <div>
          <h4>Reservation Details</h4>
          <table>
            <tbody>
              <tr>
                <td>
                  <strong>Reservation ID:</strong>
                </td>
                <td>{itinerary.ReservationID}</td>
              </tr>
              <tr>
                <td>
                  <strong>Train ID:</strong>
                </td>
                <td>{itinerary.TrainID}</td>
              </tr>
              <tr>
                <td>
                  <strong>Trip Type:</strong>
                </td>
                <td>{itinerary.TripType}</td>
              </tr>
              <tr>
                <td>
                  <strong>Passenger Type:</strong>
                </td>
                <td>{itinerary.PassengerType}</td>
              </tr>
              <tr>
                <td>
                  <strong>Total Fare:</strong>
                </td>
                <td>${itinerary.TotalFare}</td>
              </tr>
              <tr>
                <td>
                  <strong>Origin Station:</strong>
                </td>
                <td>{itinerary.DepartureStation}</td>
              </tr>
              <tr>
                <td>
                  <strong>Destination Station:</strong>
                </td>
                <td>{itinerary.ArrivalStation}</td>
              </tr>
              <tr>
                <td>
                  <strong>Departure Time:</strong>
                </td>
                <td>
                  {new Date(itinerary.DepartureDateTime).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Arrival Time:</strong>
                </td>
                <td>{new Date(itinerary.ArrivalDateTime).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TravelItineraryTab;
