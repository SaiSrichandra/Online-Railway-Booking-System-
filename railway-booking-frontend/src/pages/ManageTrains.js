import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageTrains = () => {
  const [trains, setTrains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTrain, setNewTrain] = useState({ TrainName: "", TransitLine: "" });
  const [error, setError] = useState("");

  // Fetch all trains
  const fetchTrains = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/trains");
      
      if (response.data && response.data.length === 0) {
        setError("No trains available. Please add trains first.");
      } else if (response.data) {
        setTrains(response.data); // Assuming response.data is the array of trains
        setError(""); // Clear any previous error
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch trains. Try again later.");
    }
  };
  

  // Add a new train
  const addTrain = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/trains", newTrain);
      setTrains([...trains, response.data]);
      setNewTrain({ TrainName: "", TransitLine: "" }); // Reset the form
    } catch (err) {
      setError("Failed to add train. Please check the details.");
    }
  };

  // Delete a train
  const deleteTrain = async (trainId) => {
    try {
      await axios.delete(`http://localhost:3000/api/trains/${trainId}`);
      setTrains(trains.filter((train) => train.TrainID !== trainId));
    } catch (err) {
      setError("Failed to delete train.");
    }
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  // Filter trains based on search query
  const filteredTrains = trains.filter(
    (train) =>
      train.TrainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.TransitLine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Manage Trains</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Search by Train Name or Transit Line"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Train ID</th>
            <th>Train Name</th>
            <th>Transit Line</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTrains.map((train) => (
            <tr key={train.TrainID}>
              <td>{train.TrainID}</td>
              <td>{train.TrainName}</td>
              <td>{train.TransitLine}</td>
              <td>
                <button onClick={() => deleteTrain(train.TrainID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add New Train</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTrain();
        }}
      >
        <input
          type="text"
          placeholder="Train Name"
          value={newTrain.TrainName}
          onChange={(e) => setNewTrain({ ...newTrain, TrainName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Transit Line"
          value={newTrain.TransitLine}
          onChange={(e) => setNewTrain({ ...newTrain, TransitLine: e.target.value })}
          required
        />
        <button type="submit">Add Train</button>
      </form>
    </div>
  );
};

export default ManageTrains;
