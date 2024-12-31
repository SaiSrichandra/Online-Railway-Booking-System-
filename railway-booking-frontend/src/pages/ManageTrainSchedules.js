import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const calculateTravelTime = (departureDateTime, arrivalDateTime) => {
  if (!departureDateTime || !arrivalDateTime) return "Invalid Time";

  try {
    const depTime = new Date(departureDateTime);
    const arrTime = new Date(arrivalDateTime);

    if (isNaN(depTime) || isNaN(arrTime)) {
      return "Invalid Time";
    }

    const diffMs = arrTime - depTime;

    if (diffMs < 0) {
      return "Invalid Time: Arrival before Departure";
    }

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHrs.toString().padStart(2, "0")}:${diffMins
      .toString()
      .padStart(2, "0")}:00`;
  } catch (err) {
    console.error("Error calculating travel time:", err);
    return "Invalid Time";
  }
};

const ManageTrainSchedules = () => {
  const [trainSchedules, setTrainSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    trainID: "",
    transitLineName: "",
    departureDateTime: "",
    arrivalDateTime: "",
  });
  const [error, setError] = useState("");
  const [travelTime, setTravelTime] = useState("Invalid Time");

  // Fetch train schedules from backend
  useEffect(() => {
    const fetchTrainSchedules = async () => {
      try {
        const response = await axiosInstance.get("/admin/train-schedules");
        setTrainSchedules(response.data.trainSchedules || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch train schedules.");
      }
    };
    fetchTrainSchedules();
  }, []);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Recalculate travel time when departure or arrival changes
    if (name === "departureDateTime" || name === "arrivalDateTime") {
      const newTravelTime = calculateTravelTime(
        name === "departureDateTime" ? value : newSchedule.departureDateTime,
        name === "arrivalDateTime" ? value : newSchedule.arrivalDateTime
      );
      setTravelTime(newTravelTime);
    }
  };

  // Submit new train schedule to the backend
  const handleAddSchedule = async () => {
    if (travelTime === "Invalid Time" || travelTime.includes("Invalid")) {
      setError("Cannot submit invalid travel time.");
      return;
    }

    // Convert datetime-local to MySQL-compatible format
    const formatDateTime = (dateTime) => {
      const date = new Date(dateTime);
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}:00`;
    };

    const formattedDeparture = formatDateTime(newSchedule.departureDateTime);
    const formattedArrival = formatDateTime(newSchedule.arrivalDateTime);

    try {
      const response = await axiosInstance.post("/admin/train-schedules", {
        transitLineName: newSchedule.transitLineName,
        travelTime,
        departureDateTime: formattedDeparture,
        arrivalDateTime: formattedArrival,
        trainID: newSchedule.trainID,
      });

      // Correctly structure the new schedule for the frontend
      const newAddedSchedule = {
        ScheduleID: response.data.scheduleId,
        TrainID: newSchedule.trainID,
        TransitLineName: newSchedule.transitLineName,
        DepartureDateTime: formattedDeparture,
        ArrivalDateTime: formattedArrival,
        TravelTime: travelTime,
      };

      // Update state to include the new schedule
      setTrainSchedules((prev) => [...prev, newAddedSchedule]);
      setNewSchedule({
        trainID: "",
        transitLineName: "",
        departureDateTime: "",
        arrivalDateTime: "",
      });
      setTravelTime("Invalid Time");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to add new train schedule.");
    }
  };

  return (
    <div>
      <h1>Manage Train Schedules</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Schedule ID</th>
            <th>Train ID</th>
            <th>Transit Line Name</th>
            <th>Departure DateTime</th>
            <th>Arrival DateTime</th>
            <th>Travel Time</th>
          </tr>
        </thead>
        <tbody>
          {trainSchedules.map((schedule) => (
            <tr key={schedule.ScheduleID}>
              <td>{schedule.ScheduleID}</td>
              <td>{schedule.TrainID}</td>
              <td>{schedule.TransitLineName}</td>
              <td>{schedule.DepartureDateTime}</td>
              <td>{schedule.ArrivalDateTime}</td>
              <td>{schedule.TravelTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Train Schedule</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddSchedule();
        }}
      >
        <input
          type="text"
          name="trainID"
          value={newSchedule.trainID}
          placeholder="Train ID"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="transitLineName"
          value={newSchedule.transitLineName}
          placeholder="Transit Line Name"
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          name="departureDateTime"
          value={newSchedule.departureDateTime}
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          name="arrivalDateTime"
          value={newSchedule.arrivalDateTime}
          onChange={handleInputChange}
        />
        <p>Travel Time: {travelTime}</p>
        <button type="submit">Add Schedule</button>
      </form>
    </div>
  );
};

export default ManageTrainSchedules;
