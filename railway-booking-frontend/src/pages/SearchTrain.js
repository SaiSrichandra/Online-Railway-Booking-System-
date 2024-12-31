import React, { useState } from "react";
// import "../styles/SearchTrain.css"; // CSS for styling

const SearchTrain = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");

  const handleSearch = () => {
    if (!source || !destination || !travelDate) {
      alert("Please fill all the fields to search for trains!");
      return;
    }
    console.log("Searching trains for:", source, destination, travelDate);
  };

  return (
    <div className="search-train-container">
      <div className="header">
        <h1>Railway Reservation System</h1>
        <div className="header-right">
          <span>Sign In</span>
          <span>Sign Up</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="search-form">
        <h2>Search Train</h2>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="input-field"
        >
          <option value="">--Source Station--</option>
          <option value="Station A">Station A</option>
          <option value="Station B">Station B</option>
          <option value="Station C">Station C</option>
        </select>

        <div className="swap-icon">🔄</div>

        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="input-field"
        >
          <option value="">--Destination Station--</option>
          <option value="Station X">Station X</option>
          <option value="Station Y">Station Y</option>
          <option value="Station Z">Station Z</option>
        </select>

        <input
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          className="input-field"
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchTrain;
