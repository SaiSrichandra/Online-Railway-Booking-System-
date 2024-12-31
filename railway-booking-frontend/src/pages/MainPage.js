import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const MainPage = () => {
  const [stations, setStations] = useState([]);
  const [originStation, setOriginStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [sortedSchedules, setSortedSchedules] = useState([]);
  const [trainDetails, setTrainDetails] = useState(null);
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [time, setTime] = useState("");
  const [fares, setFares] = useState({});

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/stations");
        setStations(response.data.stations);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("Failed to load stations.");
      }
    };

    fetchStations();

    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sortField === "fare") {
      const sorted = [...sortedSchedules].sort((a, b) => {
        const fareA = fares[a.ScheduleID] || 0;
        const fareB = fares[b.ScheduleID] || 0;
        return sortOrder === "asc" ? fareA - fareB : fareB - fareA;
      });
      setSortedSchedules(sorted);
    }
  }, [sortField, sortOrder, fares]);

  useEffect(() => {
    const fetchFares = async () => {
      const farePromises = sortedSchedules.map(async (schedule) => {
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
  }, [sortedSchedules]);

  const handleSearch = async () => {
    if (!originStation || !destinationStation || !travelDate) {
      setError("Please select all fields.");
      return;
    }
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:3000/api/mainPage/train-schedules",
        {
          params: { originStation, destinationStation, travelDate },
        }
      );
      setSchedules(response.data.trainSchedules);
      setSortedSchedules(response.data.trainSchedules);
    } catch (err) {
      console.error("Error fetching train schedules:", err);
      setError("Failed to fetch train schedules.");
    }
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    const sortedData = [...schedules].sort((a, b) => {
      const dateA = new Date(a[field]);
      const dateB = new Date(b[field]);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    setSortedSchedules(sortedData);
    setSortField(field);
    setSortOrder(order);
  };

  const fetchTrainDetails = async (scheduleID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/mainPage/train-schedules/${scheduleID}/stops`
      );
      setTrainDetails(response.data);
    } catch (err) {
      console.error("Error fetching train details:", err);
      setError("Failed to fetch train details.");
    }
  };

  const getFare = async (scheduleID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/mainPage/train-schedules/${scheduleID}/stops`
      );
      const fare = getFareForStations(response.data);
      return fare;
    } catch (err) {
      console.error("Error fetching train details:", err);
      setError("Failed to fetch train details.");
    }
  };

  const getStopsBetweenStations = (stops) => {
    const startIndex = stops.findIndex(
      (stop) => stop.StationName === originStation
    );
    const endIndex = stops.findIndex(
      (stop) => stop.StationName === destinationStation
    );

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return stops;
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

  const handleSortByFare = () => {
    setSortField("fare");
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mt-5">
      <div className="header text-center mb-4">
        <h1>Railway Reservation System</h1>
        <div className="d-flex justify-content-end">
          <a href="/login" className="btn btn-primary me-2">
            Sign In
          </a>
          <a href="/signup" className="btn btn-secondary">
            Sign Up
          </a>
        </div>
        <div className="time mt-2">{time}</div>
      </div>

      <div className="search-container mb-4">
        <h2>Search Train</h2>
        <div className="row mb-3">
          <div className="col">
            <select
              className="form-select"
              value={originStation}
              onChange={(e) => setOriginStation(e.target.value)}
            >
              <option value="">--Source Station--</option>
              {stations.map((station) => (
                <option key={station.StationID} value={station.StationName}>
                  {station.StationName}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <select
              className="form-select"
              value={destinationStation}
              onChange={(e) => setDestinationStation(e.target.value)}
            >
              <option value="">--Destination Station--</option>
              {stations.map((station) => (
                <option key={station.StationID} value={station.StationName}>
                  {station.StationName}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <input
              type="date"
              className="form-control"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </div>
          <div className="col">
            <button className="btn btn-success" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

      {sortedSchedules.length > 0 && (
        <div className="results-container">
          <h3>Available Train Schedules</h3>
          <div className="sorting-buttons mb-3">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => handleSort("ArrivalDateTime")}
            >
              Sort by Arrival Time
            </button>
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => handleSort("DepartureDateTime")}
            >
              Sort by Departure Time
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={handleSortByFare}
            >
              Sort by Fare ({sortOrder === "asc" ? "Ascending" : "Descending"})
            </button>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Train ID</th>
                <th>Transit Line</th>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>Fare</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedSchedules.map((schedule) => (
                <tr key={schedule.ScheduleID}>
                  <td>{schedule.TrainID}</td>
                  <td>{schedule.TransitLineName}</td>
                  <td>
                    {new Date(schedule.DepartureDateTime).toLocaleString()}
                  </td>
                  <td>{new Date(schedule.ArrivalDateTime).toLocaleString()}</td>
                  <td>{fares[schedule.ScheduleID]}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => fetchTrainDetails(schedule.ScheduleID)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {trainDetails && (
        <div className="train-details mt-4">
          <h3>Train Details</h3>
          <p>
            <strong>Fare:</strong> ${getFareForStations(trainDetails)}
          </p>
          <h4>Stops:</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Station</th>
                <th>Arrival</th>
                <th>Departure</th>
              </tr>
            </thead>
            <tbody>
              {getStopsBetweenStations(trainDetails.Stops).map((stop, idx) => (
                <tr key={idx}>
                  <td>{stop.StationName}</td>
                  <td>{new Date(stop.ArrivalDateTime).toLocaleString()}</td>
                  <td>{new Date(stop.DepartureDateTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MainPage;
