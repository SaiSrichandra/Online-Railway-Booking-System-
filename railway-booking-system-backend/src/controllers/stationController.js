const db = require("../models/db");

exports.getAllStation = (req, res) => {
    const query = `Select * from Station`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching stations" });
          }
          res.status(200).json({ stations: results });
    });
};

exports.createStation = (req, res) => {
    const {
        stationName,
        city,
        state
    } = req.body;
    
    if (!stationName || !city || !state) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `INSERT INTO Station (StationName, City, State) VALUES (?, ?, ?)`;

    db.query(query, [stationName, city, state], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error creating station" });
        }
        res.status(201).json({ message: "Station created successfully", stationId: result.insertId });
    });
};