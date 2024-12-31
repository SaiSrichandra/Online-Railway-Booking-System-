// controllers/trainScheduleController.js
const db = require("../models/db"); // MySQL connection


// controllers/trainScheduleController.js
exports.createTrainSchedule = (req, res) => {
    const { transitLineName, travelTime, arrivalDateTime, departureDateTime, trainId } = req.body;
  
    // Validate that the required fields are present
    if (!transitLineName || !travelTime || !arrivalDateTime || !departureDateTime || !trainId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // SQL query to insert a new train schedule
    const query = `INSERT INTO TrainSchedule (TransitLineName, TravelTime, ArrivalDateTime, DepartureDateTime, TrainID) 
      VALUES (?, ?, ?, ?, ?)`;
  
    db.query(query, [transitLineName, travelTime, arrivalDateTime, departureDateTime, trainId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating train schedule" });
      }
      res.status(201).json({ message: "Train schedule created successfully", scheduleId: result.insertId });
    });
  };

  // controllers/trainScheduleController.js
exports.getTrainScheduleById = (req, res) => {
    const scheduleId = req.params.id;
  
    const query = `SELECT * FROM TrainSchedule WHERE ScheduleID = ?`;
  
    db.query(query, [scheduleId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching train schedule" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Train schedule not found" });
      }
  
      res.status(200).json({ trainSchedule: results[0] });
    });
  };


// Add a new train schedule
// exports.addTrainSchedule = (req, res) => {
//   const {
//     TransitLineName,
//     TravelTime,
//     ArrivalDateTime,
//     DepartureDateTime,
//     TrainID,
//   } = req.body;

//   if (!TransitLineName || !TravelTime || !ArrivalDateTime || !DepartureDateTime || !TrainID) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   const query = `INSERT INTO TrainSchedule (TransitLineName, TravelTime, ArrivalDateTime, DepartureDateTime, TrainID)
//                  VALUES (?, ?, ?, ?, ?)`;

//   db.query(query, [TransitLineName, TravelTime, ArrivalDateTime, DepartureDateTime, TrainID], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Error adding train schedule" });
//     }
//     res.status(201).json({ message: "Train schedule added successfully", scheduleId: result.insertId });
//   });
// };

// Add a new train schedule
exports.addTrainSchedule = (req, res) => {
  const {
    transitLineName,
    travelTime,
    arrivalDateTime,
    departureDateTime,
    trainID,
    stops
  } = req.body;

  if (!transitLineName || !travelTime || !arrivalDateTime || !departureDateTime || !trainID) {
    return res.status(400).json({ message: "All train schedule fields are required" });
  }

  // Insert into TrainSchedule table
  const insertTrainScheduleQuery = `
    INSERT INTO TrainSchedule (TransitLineName, TravelTime, ArrivalDateTime, DepartureDateTime, TrainID)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertTrainScheduleQuery,
    [transitLineName, travelTime, arrivalDateTime, departureDateTime, trainID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error adding train schedule" });
      }

      const scheduleId = result.insertId;

      // Insert stops into the Stop table
      if (stops && stops.length > 0) {
        const insertStopsQuery = `
          INSERT INTO Stop (TransitLineName, StationID, ArrivalDateTime, DepartureDateTime)
          VALUES (?, ?, ?, ?)
        `;

        stops.forEach((stop) => {
          db.query(
            insertStopsQuery,
            [transitLineName, stop.stationID, stop.arrivalDateTime, stop.departureDateTime],
            (stopErr) => {
              if (stopErr) {
                console.error(stopErr);
                return res.status(500).json({ message: "Error adding stops for train schedule" });
              }
            }
          );
        });
      }

      res.status(201).json({ message: "Train schedule added successfully", scheduleId });
    }
  );
};

// Update an existing train schedule
exports.updateTrainSchedule = (req, res) => {
  const {
    ScheduleID,
    TransitLineName,
    TravelTime,
    ArrivalDateTime,
    DepartureDateTime,
    TrainID,
  } = req.body;

  const query = `UPDATE TrainSchedule 
                 SET TransitLineName = ?, TravelTime = ?, ArrivalDateTime = ?, DepartureDateTime = ?, TrainID = ?
                 WHERE ScheduleID = ?`;

  db.query(
    query,
    [TransitLineName, TravelTime, ArrivalDateTime, DepartureDateTime, TrainID, ScheduleID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating train schedule" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Train schedule not found" });
      }

      res.status(200).json({ message: "Train schedule updated successfully" });
    }
  );
};


// Delete a train schedule
exports.deleteTrainSchedule = (req, res) => {
  const scheduleId = req.params.id;

  const query = `DELETE FROM TrainSchedule WHERE ScheduleID = ?`;

  db.query(query, [scheduleId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error deleting train schedule" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Train schedule not found" });
    }

    res.status(200).json({ message: "Train schedule deleted successfully" });
  });
};

exports.getAllTrainSchedules = (req, res) => {
  const query = `
    SELECT 
      ts.ScheduleID,
      ts.TransitLineName,
      ts.TravelTime,
      ts.ArrivalDateTime,
      ts.DepartureDateTime,
      ts.TrainID,
      (SELECT COUNT(*) FROM Reservation WHERE ScheduleID = ts.ScheduleID) AS ReservationCount
    FROM 
      TrainSchedule ts
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching train schedules' });
    }
    res.status(200).json({ trainSchedules: results });
  });
};


// // Get all train schedules for a given station
// exports.getSchedulesForStation = (req, res) => {
//   const { stationName } = req.query;

//   if (!stationName) {
//     return res.status(400).json({ message: "Station name is required" });
//   }

//   const query = `
//     SELECT 
//       ts.ScheduleID,
//       ts.TransitLineName,
//       ts.TravelTime,
//       ts.ArrivalDateTime,
//       ts.DepartureDateTime,
//       ts.TrainID,
//       s1.StationName AS OriginStation,
//       s2.StationName AS DestinationStation
//     FROM 
//       TrainSchedule ts
//     JOIN 
//       Station s1 ON ts.OriginStationID = s1.StationID
//     JOIN 
//       Station s2 ON ts.DestinationStationID = s2.StationID
//     WHERE 
//       s1.StationName = ? OR s2.StationName = ?;
//   `;

//   db.query(query, [stationName, stationName], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Error fetching train schedules for the station" });
//     }

//     res.status(200).json({ trainSchedules: results });
//   });
// };


exports.addTrainSchedule = (req, res) => {
  const { transitLineName, travelTime, arrivalDateTime, departureDateTime, trainID, stops } = req.body;

  if (!transitLineName || !arrivalDateTime || !departureDateTime || !trainID) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const insertScheduleQuery = `
    INSERT INTO TrainSchedule (TransitLineName, TravelTime, ArrivalDateTime, DepartureDateTime, TrainID)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertScheduleQuery,
    [transitLineName, travelTime, arrivalDateTime, departureDateTime, trainID],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error adding train schedule" });
      }

      const scheduleID = result.insertId;

      if (stops && stops.length > 0) {
        const insertStopsQuery = `
          INSERT INTO Stop (TransitLineName, StationID, ArrivalDateTime, DepartureDateTime)
          VALUES (?, ?, ?, ?)
        `;

        stops.forEach((stop) => {
          db.query(
            insertStopsQuery,
            [transitLineName, stop.stationID, stop.arrivalDateTime, stop.departureDateTime],
            (stopErr) => {
              if (stopErr) {
                console.error(stopErr);
                return res.status(500).json({ message: "Error adding stops for train schedule" });
              }
            }
          );
        });
      }

      res.status(201).json({ message: "Train schedule added successfully", scheduleID });
    }
  );
};

// Get all train schedules for a given station (as origin or destination)
exports.getSchedulesForStation = (req, res) => {
  const { stationName } = req.query;

  if (!stationName) {
    return res.status(400).json({ message: "Station name is required" });
  }

  const query = `
    SELECT 
      ts.ScheduleID,
      ts.TransitLineName,
      ts.TravelTime,
      ts.ArrivalDateTime,
      ts.DepartureDateTime,
      ts.TrainID,
      s.StationName AS Station
    FROM 
      TrainSchedule ts
    JOIN 
      Stop st ON ts.TransitLineName = st.TransitLineName
    JOIN 
      Station s ON st.StationID = s.StationID
    WHERE 
      s.StationName = ?;
  `;

  db.query(query, [stationName], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching train schedules for the station" });
    }

    res.status(200).json({ trainSchedules: results });
  });
};
