import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../styles/ManageSchedulesTab.css";

const ManageSchedulesTab = () => {
  const [schedules, setSchedules] = useState([]);
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);
  const [transitLines, setTransitLines] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    transitLineName: "",
    travelTime: "",
    arrivalDateTime: "",
    departureDateTime: "",
    trainID: "",
    stops: [],
  });
  const [showAddScheduleForm, setShowAddScheduleForm] = useState(false);
  const [searchStationName, setSearchStationName] = useState("");
  const [searchedSchedules, setSearchedSchedules] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchedules();
    fetchStations();
    fetchTrains(); // Fetch available trains for dropdown
    fetchTransitLines(); // Fetch available transit lines for dropdown
  }, []);

  // Fetch all train schedules
  const fetchSchedules = async () => {
    try {
      const response = await axiosInstance.get("/customer-rep/train-schedules");
      setSchedules(response.data.trainSchedules);
      setError("");
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to fetch schedules.");
    }
  };

  // Fetch all available stations for stops selection
  const fetchStations = async () => {
    try {
      const response = await axiosInstance.get("/stations");
      setStations(response.data.stations);
    } catch (err) {
      console.error("Error fetching stations:", err);
    }
  };

  // Fetch all available trains for TrainID dropdown
  const fetchTrains = async () => {
    try {
      const response = await axiosInstance.get("/customer-rep/trains");
      setTrains(response.data.trains);
    } catch (err) {
      console.error("Error fetching trains:", err);
    }
  };

  // Fetch all available transit lines for selection
  const fetchTransitLines = async () => {
    try {
      const response = await axiosInstance.get("/transit-lines");
      setTransitLines(response.data.transitLines);
    } catch (err) {
      console.error("Error fetching transit lines:", err);
    }
  };

  // Handle input change for new schedule form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle stops selection
  const handleStopSelection = (e) => {
    const stationID = parseInt(e.target.value);
    const isChecked = e.target.checked;

    setNewSchedule((prev) => {
      const updatedStops = isChecked
        ? [
            ...prev.stops,
            { stationID, arrivalDateTime: "", departureDateTime: "" },
          ]
        : prev.stops.filter((stop) => stop.stationID !== stationID);

      return { ...prev, stops: updatedStops };
    });
  };

  // Handle arrival and departure date-time changes for each stop
  const handleStopDateTimeChange = (stationID, field, value) => {
    setNewSchedule((prev) => {
      const updatedStops = prev.stops.map((stop) => {
        if (stop.stationID === stationID) {
          return { ...stop, [field]: value };
        }
        return stop;
      });
      return { ...prev, stops: updatedStops };
    });
  };

  // Handle save button click for adding the new schedule
  const handleAddSchedule = async () => {
    try {
      await axiosInstance.post("/customer-rep/train-schedules", newSchedule);
      setNewSchedule({
        transitLineName: "",
        travelTime: "",
        arrivalDateTime: "",
        departureDateTime: "",
        trainID: "",
        stops: [],
      });
      setShowAddScheduleForm(false);
      fetchSchedules(); // Re-fetch schedules to reflect the new addition
      setError("");
    } catch (err) {
      console.error("Error adding train schedule:", err);
      setError("Failed to add train schedule.");
    }
  };

  const handleSearchSchedules = async () => {
    if (!searchStationName) {
      setError("Please select a station to search.");
      setSearchTriggered(false);
      return;
    }

    setSearchTriggered(true);
    try {
      const response = await axiosInstance.get(
        `/customer-rep/train-schedules/station?stationName=${searchStationName}`
      );
      setSearchedSchedules(response.data.trainSchedules);
      setError("");
    } catch (err) {
      console.error("Error searching schedules:", err);
      setError("Failed to search schedules.");
    }
  };

  // Handle edit button click
  const handleEditClick = (schedule) => {
    setEditingSchedule({
      ...schedule,
      ArrivalDate: schedule.ArrivalDateTime.split("T")[0],
      ArrivalTime: schedule.ArrivalDateTime.split("T")[1]?.substring(0, 5),
      DepartureDate: schedule.DepartureDateTime.split("T")[0],
      DepartureTime: schedule.DepartureDateTime.split("T")[1]?.substring(0, 5),
    });
  };

  // Handle input change for editable fields
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSchedule((prev) => {
      const updatedSchedule = {
        ...prev,
        [name]: value,
      };

      // Automatically calculate travel time if arrival or departure changes
      if (
        name === "ArrivalDate" ||
        name === "ArrivalTime" ||
        name === "DepartureDate" ||
        name === "DepartureTime"
      ) {
        const arrivalDateTime = `${updatedSchedule.ArrivalDate}T${updatedSchedule.ArrivalTime}:00`;
        const departureDateTime = `${updatedSchedule.DepartureDate}T${updatedSchedule.DepartureTime}:00`;

        if (
          updatedSchedule.ArrivalDate &&
          updatedSchedule.ArrivalTime &&
          updatedSchedule.DepartureDate &&
          updatedSchedule.DepartureTime
        ) {
          const arrival = new Date(arrivalDateTime);
          const departure = new Date(departureDateTime);

          // Calculate the travel time in hours and minutes
          const diffMs = Math.abs(arrival - departure);
          const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMinutes = Math.floor(
            (diffMs % (1000 * 60 * 60)) / (1000 * 60)
          );

          updatedSchedule.TravelTime = `${diffHours}:${
            diffMinutes < 10 ? "0" : ""
          }${diffMinutes}`;
        }
      }

      return updatedSchedule;
    });
  };

  // Handle save button click for updating the schedule
  const handleSave = async (scheduleId) => {
    try {
      const updatedSchedule = {
        ...editingSchedule,
        ArrivalDateTime: `${editingSchedule.ArrivalDate}T${editingSchedule.ArrivalTime}:00`,
        DepartureDateTime: `${editingSchedule.DepartureDate}T${editingSchedule.DepartureTime}:00`,
      };
      await axiosInstance.put(
        `/customer-rep/train-schedules/${scheduleId}`,
        updatedSchedule
      );
      setEditingSchedule(null);
      fetchSchedules(); // Re-fetch schedules to reflect the updates
    } catch (err) {
      console.error("Error updating schedule:", err);
      setError("Failed to update train schedule.");
    }
  };

  // Handle cancel button click to cancel editing
  const handleCancel = () => {
    setEditingSchedule(null);
  };

  // Handle delete button click for removing a schedule
  const handleDelete = async (scheduleId) => {
    try {
      await axiosInstance.delete(`/customer-rep/train-schedules/${scheduleId}`);
      setSchedules(
        schedules.filter((schedule) => schedule.ScheduleID !== scheduleId)
      );
    } catch (err) {
      console.error("Error deleting schedule:", err);
      setError("Failed to delete train schedule.");
    }
  };

  return (
    <div>
      <h2>Manage Train Schedules</h2>
      {error && <p className="error">{error}</p>}

      {/* Button to toggle Add Train Schedule Form */}
      <div style={{ marginBottom: "20px" }}>
        <button
          className="small"
          onClick={() => setShowAddScheduleForm(!showAddScheduleForm)}
        >
          {showAddScheduleForm
            ? "Hide Add Train Schedule"
            : "Add Train Schedule"}
        </button>
      </div>

      {/* Add Train Schedule Form */}
      {showAddScheduleForm && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Add Train Schedule</h3>
          <select
            name="transitLineName"
            value={newSchedule.transitLineName}
            onChange={handleInputChange}
          >
            <option value="">Select Transit Line</option>
            {transitLines.map((line) => (
              <option key={line.TransitLineName} value={line.TransitLineName}>
                {line.TransitLineName}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="travelTime"
            placeholder="Travel Time (HH:MM)"
            value={newSchedule.travelTime}
            onChange={handleInputChange}
          />
          <input
            type="datetime-local"
            name="arrivalDateTime"
            placeholder="Arrival DateTime"
            value={newSchedule.arrivalDateTime}
            onChange={handleInputChange}
          />
          <input
            type="datetime-local"
            name="departureDateTime"
            placeholder="Departure DateTime"
            value={newSchedule.departureDateTime}
            onChange={handleInputChange}
          />
          <select
            name="trainID"
            value={newSchedule.trainID}
            onChange={handleInputChange}
          >
            <option value="">Select Train ID</option>
            {trains.map((train) => (
              <option key={train.TrainID} value={train.TrainID}>
                {train.TrainID}
              </option>
            ))}
          </select>

          <h4>Select Stops</h4>
          {stations.map((station) => (
            <div key={station.StationID}>
              <label>
                <input
                  type="checkbox"
                  value={station.StationID}
                  onChange={handleStopSelection}
                />
                {station.StationName}
              </label>
              {newSchedule.stops.some(
                (stop) => stop.stationID === station.StationID
              ) && (
                <div>
                  <input
                    type="datetime-local"
                    placeholder="Arrival DateTime"
                    onChange={(e) =>
                      handleStopDateTimeChange(
                        station.StationID,
                        "arrivalDateTime",
                        e.target.value
                      )
                    }
                  />
                  <input
                    type="datetime-local"
                    placeholder="Departure DateTime"
                    onChange={(e) =>
                      handleStopDateTimeChange(
                        station.StationID,
                        "departureDateTime",
                        e.target.value
                      )
                    }
                  />
                </div>
              )}
            </div>
          ))}

          <button className="small" onClick={handleAddSchedule}>
            Add Schedule
          </button>
        </div>
      )}

      {/* Display All Train Schedules */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Current Train Schedules</h3>
        <table>
          <thead>
            <tr>
              <th>Schedule ID</th>
              <th>Transit Line Name</th>
              <th>Travel Time</th>
              <th>Arrival Date</th>
              <th>Arrival Time</th>
              <th>Departure Date</th>
              <th>Departure Time</th>
              <th>Train ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.ScheduleID}>
                {editingSchedule &&
                editingSchedule.ScheduleID === schedule.ScheduleID ? (
                  <>
                    <td>{schedule.ScheduleID}</td>
                    <td>
                      <input
                        type="text"
                        name="TransitLineName"
                        value={editingSchedule.TransitLineName}
                        onChange={handleEditInputChange}
                      />
                    </td>
                    <td>{editingSchedule.TravelTime}</td>
                    <td>
                      <input
                        type="date"
                        name="ArrivalDate"
                        value={editingSchedule.ArrivalDate}
                        onChange={handleEditInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        name="ArrivalTime"
                        value={editingSchedule.ArrivalTime}
                        onChange={handleEditInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="DepartureDate"
                        value={editingSchedule.DepartureDate}
                        onChange={handleEditInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        name="DepartureTime"
                        value={editingSchedule.DepartureTime}
                        onChange={handleEditInputChange}
                      />
                    </td>
                    <td>
                      <select
                        name="TrainID"
                        value={editingSchedule.TrainID}
                        onChange={handleEditInputChange}
                      >
                        <option value="">Select Train ID</option>
                        {trains.map((train) => (
                          <option key={train.TrainID} value={train.TrainID}>
                            {train.TrainID}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="small"
                        onClick={() => handleSave(schedule.ScheduleID)}
                      >
                        Save
                      </button>
                      <button
                        className="small"
                        onClick={handleCancel}
                        style={{ marginLeft: "5px" }}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{schedule.ScheduleID}</td>
                    <td>{schedule.TransitLineName}</td>
                    <td>{schedule.TravelTime}</td>
                    <td>{schedule.ArrivalDateTime.split("T")[0]}</td>
                    <td>
                      {schedule.ArrivalDateTime.split("T")[1]?.substring(0, 5)}
                    </td>
                    <td>{schedule.DepartureDateTime.split("T")[0]}</td>
                    <td>
                      {schedule.DepartureDateTime.split("T")[1]?.substring(
                        0,
                        5
                      )}
                    </td>
                    <td>{schedule.TrainID}</td>
                    <td>
                      <button
                        className="small"
                        onClick={() => handleEditClick(schedule)}
                        style={{ marginRight: "5px" }}
                      >
                        Edit
                      </button>
                      {schedule.ReservationCount === 0 ? (
                        <button
                          className="small"
                          onClick={() => handleDelete(schedule.ScheduleID)}
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          className="small"
                          disabled
                          title="Cannot delete. Reservations exist."
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Search Train Schedules by Station */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Search Train Schedules by Station (Origin or Destination)</h3>
        <select
          value={searchStationName}
          onChange={(e) => setSearchStationName(e.target.value)}
        >
          <option value="">Select Station</option>
          {stations.map((station) => (
            <option key={station.StationID} value={station.StationName}>
              {station.StationName}
            </option>
          ))}
        </select>
        <button className="small" onClick={handleSearchSchedules}>
          Search Schedules by Station
        </button>

        {/* Render search results */}
        {searchTriggered &&
          (searchedSchedules.length > 0 ? (
            <table style={{ marginTop: "20px" }}>
              <thead>
                <tr>
                  <th>Schedule ID</th>
                  <th>Transit Line Name</th>
                  <th>Travel Time</th>
                  <th>Arrival Date</th>
                  <th>Arrival Time</th>
                  <th>Departure Date</th>
                  <th>Departure Time</th>
                  <th>Train ID</th>
                </tr>
              </thead>
              <tbody>
                {searchedSchedules.map((schedule) => (
                  <tr key={schedule.ScheduleID}>
                    <td>{schedule.ScheduleID}</td>
                    <td>{schedule.TransitLineName}</td>
                    <td>{schedule.TravelTime}</td>
                    <td>{schedule.ArrivalDateTime.split("T")[0]}</td>
                    <td>
                      {schedule.ArrivalDateTime.split("T")[1]?.substring(0, 5)}
                    </td>
                    <td>{schedule.DepartureDateTime.split("T")[0]}</td>
                    <td>
                      {schedule.DepartureDateTime.split("T")[1]?.substring(
                        0,
                        5
                      )}
                    </td>
                    <td>{schedule.TrainID}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="error" style={{ color: "red" }}>
              No train schedules found for the selected station.
            </p>
          ))}
      </div>
    </div>
  );
};

export default ManageSchedulesTab;
