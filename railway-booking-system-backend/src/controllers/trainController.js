// controllers/trainController.js
const db = require("../models/db");

// Search for available trains
exports.searchTrains = (req, res) => {
    const { origin, destination, date } = req.query;
    const query = `
      SELECT 
        ts.TrainID,
        ts.TransitLineName,
        ts.DepartureDateTime,
        ts.ArrivalDateTime,
        tl.OriginStationID,
        tl.DestinationStationID,
        tl.BaseFare,
        tl.Stops
      FROM TrainSchedule ts
      JOIN TransitLine tl 
        ON ts.TransitLineName = tl.TransitLineName
      WHERE tl.OriginStationID = ? 
        AND tl.DestinationStationID = ? 
        AND DATE(ts.DepartureDateTime) = ?;
    `;
    db.query(query, [origin, destination, date], (err, results) => {
      if (err) {
        console.error("Error searching for trains:", err);
        return res.status(500).json({ message: "Failed to search trains" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "No trains found for the given criteria" });
      }
      res.status(200).json(results);
    });
};

// Get all trains
exports.getAllTrains = (req, res) => {
  const query = `SELECT * FROM Train`;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching trains" });
    }
    res.status(200).json({ trains: results });
  });
};

// Endpoint to get all available transit lines with only necessary fields
