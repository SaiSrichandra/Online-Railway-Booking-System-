import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../styles/TrainSchedulesTab.css";

const TrainSchedulesTab = ({ stations }) => {
  const [originStation, setOriginStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [error, setError] = useState("");
  const [passengerType, setPassengerType] = useState("adult");
  const [reservationDetails, setReservationDetails] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [roundTrip, setRoundTrip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fares, setFares] = useState({});

  // Clear reservation details when inputs change
  useEffect(() => {
    setReservationDetails(null);
    setSelectedSchedule(null);
  }, [originStation, destinationStation, travelDate]);

  useEffect(() => {
    const fetchFares = async () => {
      const farePromises = availableSchedules.map(async (schedule) => {
        const fare = await getFare(schedule.ScheduleID);
        return { [schedule.ScheduleID]: fare };
      });
      const fareResults = await Promise.all(farePromises);
      const fareMap = fareResults.reduce(
        (acc, fare) => ({ ...acc, ...fare }),
        {}
      );
      setFares(fareMap);
    };

    fetchFares();
  }, [availableSchedules]);

  // Search for train schedules
  const handleSearchSchedules = async () => {
    if (!originStation || !destinationStation || !travelDate) {
      setError("Please select all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get("/customer/train-schedules", {
        params: { originStation, destinationStation, travelDate },
      });
      setAvailableSchedules(response.data.trainSchedules);
      setError("");
    } catch (err) {
      console.error("Error fetching train schedules:", err);
      setError("Failed to fetch train schedules.");
    } finally {
      setLoading(false);
    }
  };

  // Book a reservation
  const handleBookNow = async (schedule) => {
    const customerId = localStorage.getItem("customerId"); // Retrieve customer ID from localStorage
    if (!customerId) {
      setError("Customer ID not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        customerId,
        transitLineName: schedule.TransitLineName,
        trainId: schedule.TrainID,
        originStation,
        destinationStation,
        travelDate,
        tripType: roundTrip ? "Two-Way" : "One-Way",
        isRoundTrip: roundTrip,
        passengerType,
      };

      const response = await axiosInstance.post(
        "/customer/reservations",
        payload
      );
      setReservationDetails({
        reservationId: response.data.reservationId,
        fare: response.data.fare,
      });
      setError("");
    } catch (err) {
      console.error("Error creating reservation:", err);
      setError("Failed to create reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFare = async (scheduleID) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:3000/api/mainPage/train-schedules/${scheduleID}/stops`
      );
      const fare = getFareForStations(response.data);
      return fare;
    } catch (err) {
      console.error("Error fetching train details:", err);
      setError("Failed to fetch train details.");
    }
  };

  // Get Stops between Source and Destination
  const getStopsBetweenStations = (stops) => {
    const startIndex = stops.findIndex(
      (stop) => stop.StationName === originStation
    );
    const endIndex = stops.findIndex(
      (stop) => stop.StationName === destinationStation
    );

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return stops; // Fallback to showing all stops
    }
    return stops.slice(startIndex, endIndex + 1);
  };

  const getFareForStations = (responseData) => {
    const stopCount = responseData.Stops.length - 1;
    const farePerStop = responseData.BaseFare / stopCount;

    const x =
      (getStopsBetweenStations(responseData.Stops).length - 1) * farePerStop;
    return x;
  };

  return (
    <div className="train-schedules-tab">
      <h3>Search & Book Train Schedules</h3>

      {/* Search Inputs */}
      <div className="form-group">
        <label>Origin Station</label>
        <select
          value={originStation}
          onChange={(e) => setOriginStation(e.target.value)}
        >
          <option value="">Select Origin Station</option>
          {stations.map((station) => (
            <option key={station.StationID} value={station.StationName}>
              {station.StationName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Destination Station</label>
        <select
          value={destinationStation}
          onChange={(e) => setDestinationStation(e.target.value)}
        >
          <option value="">Select Destination Station</option>
          {stations.map((station) => (
            <option key={station.StationID} value={station.StationName}>
              {station.StationName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Trip Type</label>
        <select
          value={roundTrip ? "round-trip" : "one-way"}
          onChange={(e) => setRoundTrip(e.target.value === "round-trip")}
        >
          <option value="one-way">One Way</option>
          <option value="round-trip">Round Trip</option>
        </select>
      </div>

      <div className="form-group">
        <label>Travel Date</label>
        <input
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
        />
      </div>

      <button onClick={handleSearchSchedules} disabled={loading}>
        {loading ? "Searching..." : "Search Schedules"}
      </button>

      {/* Error Messages */}
      {error && <p className="error">{error}</p>}

      {/* Train Schedule Results */}
      {availableSchedules.length > 0 && (
        <div>
          <h4>Available Train Schedules</h4>
          <table>
            <thead>
              <tr>
                <th>Schedule ID</th>
                <th>Transit Line Name</th>
                <th>Train ID</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Passenger Type</th>
                <th>Fare</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availableSchedules.map((schedule) => (
                <tr key={schedule.ScheduleID}>
                  <td>{schedule.ScheduleID}</td>
                  <td>{schedule.TransitLineName}</td>
                  <td>{schedule.TrainID}</td>
                  <td>
                    {new Date(schedule.DepartureDateTime).toLocaleString()}
                  </td>
                  <td>{new Date(schedule.ArrivalDateTime).toLocaleString()}</td>
                  <td>
                    <select
                      value={passengerType}
                      onChange={(e) => setPassengerType(e.target.value)}
                    >
                      <option value="adult">Adult</option>
                      <option value="child">Child</option>
                      <option value="senior">Senior</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </td>

                  <td>{fares[schedule.ScheduleID] * (roundTrip ? 2 : 1)}</td>
                  <td>
                    <button
                      onClick={() => handleBookNow(schedule)}
                      disabled={loading}
                    >
                      {loading ? "Booking..." : "Book Now"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Success Message */}
      {reservationDetails && (
        <div>
          <h4>Reservation Successful!</h4>
          <p>Reservation ID: {reservationDetails.reservationId}</p>
          <p>Total Fare: ${reservationDetails.fare}</p>
        </div>
      )}
    </div>
  );
};

export default TrainSchedulesTab;
