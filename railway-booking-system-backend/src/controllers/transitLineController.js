const db = require("../models/db"); 

exports.getTransitLines = (req, res) => {
    const query = `SELECT TransitLineName FROM TransitLine`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching transit lines" });
      }
  
      res.status(200).json({ transitLines: results });
    });
  };
  