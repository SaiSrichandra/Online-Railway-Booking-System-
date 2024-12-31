const db = require("../models/db");

exports.searchTrainSchedules = (req, res) => {
    const query = 'SELECT * FROM TrainSchedule';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching train schedules:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      res.status(200).json({ trainSchedules: results });
    });
  };

// Controller to fetch stop details by ScheduleID
exports.getStopsByScheduleID = (req, res) => {
  const { scheduleID } = req.params;

  // Query to fetch stops, arrival/departure times, and fare
  const query = `
    SELECT 
        ts.ScheduleID,
        tl.BaseFare,
        st.StationName,
        s.ArrivalDateTime,
        s.DepartureDateTime
    FROM TrainSchedule ts
    JOIN Stop s ON ts.TransitLineName = s.TransitLineName
    JOIN Station st ON s.StationID = st.StationID
    JOIN TransitLine tl ON ts.TransitLineName = tl.TransitLineName
    WHERE ts.ScheduleID = ?
    ORDER BY s.ArrivalDateTime;
  `;

  db.query(query, [scheduleID], (err, results) => {
    if (err) {
      console.error("Error fetching stops:", err);
      return res.status(500).json({ message: "Failed to fetch train stops." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No stops found for the given ScheduleID." });
    }

    // Sending the fetched data
    res.status(200).json({
      ScheduleID: scheduleID,
      BaseFare: results[0]?.BaseFare,
      Stops: results.map((row) => ({
        StationName: row.StationName,
        ArrivalDateTime: row.ArrivalDateTime,
        DepartureDateTime: row.DepartureDateTime,
      })),
    });
  });
};

  