// controllers/adminController.js
const db = require("../models/db");

// Get all customers
exports.getAllCustomers = (req, res) => {
  const query = `SELECT * FROM Customer`;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching customers" });
    }
    res.status(200).json({ customers: results });
  });
};


// Update reservation details
exports.updateReservation = (req, res) => {
    const reservationId = req.params.id;
    const { tripType, passengerType, totalFare } = req.body;
  
    const query = `UPDATE Reservation 
      SET TripType = ?, PassengerType = ?, TotalFare = ? 
      WHERE ReservationID = ?`;
  
    db.query(query, [tripType, passengerType, totalFare, reservationId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating reservation" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.status(200).json({ message: "Reservation updated successfully" });
    });
};
  
  // Cancel a reservation
exports.cancelReservation = (req, res) => {
  const reservationId = req.params.id;

  const query = `DELETE FROM Reservation WHERE ReservationID = ?`;

  db.query(query, [reservationId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error cancelling reservation" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.status(200).json({ message: "Reservation cancelled successfully" });
  });
};

  // Simulate payment process
exports.processPayment = (req, res) => {
    const { reservationId, paymentAmount } = req.body;
  
    // Mock payment process
    if (!reservationId || !paymentAmount) {
      return res.status(400).json({ message: "Reservation ID and payment amount are required" });
    }
  
    const query = `UPDATE Reservation SET PaymentStatus = 'Paid' WHERE ReservationID = ?`;
  
    db.query(query, [reservationId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error processing payment" });
      }
      res.status(200).json({ message: "Payment processed successfully" });
    });
  };

// Get all reservations
exports.getAllReservations = (req, res) => {
  const query = `SELECT * FROM Reservation`;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching reservations" });
    }
    res.status(200).json({ reservations: results });
  });
};

// Update a reservation
exports.updateReservation = (req, res) => {
  const reservationId = req.params.id;
  const { tripType, passengerType, totalFare, arrivalDateTime, departureDateTime } = req.body;

  const query = `UPDATE Reservation
                 SET TripType = ?, PassengerType = ?, TotalFare = ?, ArrivalDateTime = ?, DepartureDateTime = ?
                 WHERE ReservationID = ?`;

  db.query(query, [tripType, passengerType, totalFare, arrivalDateTime, departureDateTime, reservationId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating reservation" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation updated successfully" });
  });
};

// Delete a reservation
exports.deleteReservation = (req, res) => {
  const reservationId = req.params.id;

  const query = `DELETE FROM Reservation WHERE ReservationID = ?`;

  db.query(query, [reservationId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error deleting reservation" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  });
};

// controllers/adminController.js
exports.getSalesReport = async (req, res) => {
  const { month } = req.query;

  try {
    const query = month && month !== "all"
      ? `
        SELECT 
          DATE_FORMAT(ReservationDate, '%M') AS month, 
          SUM(TotalFare) AS revenue 
        FROM Reservation 
        WHERE MONTH(ReservationDate) = ? 
        GROUP BY DATE_FORMAT(ReservationDate, '%M')
      `
      : `
        SELECT 
          DATE_FORMAT(ReservationDate, '%M') AS month, 
          SUM(TotalFare) AS revenue 
        FROM Reservation 
        GROUP BY DATE_FORMAT(ReservationDate, '%M')
      `;

    const params = month && month !== "all" ? [month] : [];
    db.query(query, params, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching sales report." });
      }
      res.status(200).json(results);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};


exports.getTransitLines = (req, res) => {
  const query = "SELECT TransitLineName FROM TransitLine";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching transit lines:", err);
      return res.status(500).json({ message: "Error fetching transit lines" });
    }
    res.status(200).json(results);
  });
};

// exports.filterReservations = (req, res) => {
//   const { customerName, transitLine, tripType } = req.query;

//   // Base query
//   let query = `
//     SELECT 
//       r.ReservationID,
//       r.ReservationDate,
//       c.FirstName AS CustomerFirstName,
//       c.LastName AS CustomerLastName,
//       ts.TransitLineName AS TransitLine,
//       r.TotalFare,
//       r.TripType,
//       r.DepartureStation,
//       r.ArrivalStation
//     FROM 
//       Reservation r
//     JOIN 
//       Customer c ON r.CustomerID = c.CustomerID
//     JOIN 
//       TrainSchedule ts ON r.ScheduleID = ts.ScheduleID
//   `;

//   // Dynamic filtering conditions
//   const conditions = [];
//   if (customerName) {
//     conditions.push(`CONCAT(c.FirstName, ' ', c.LastName) LIKE '%${customerName}%'`);
//   }
//   if (transitLine) {
//     conditions.push(`ts.TransitLineName LIKE '%${transitLine}%'`);
//   }
//   if (tripType) {
//     conditions.push(`r.TripType = '${tripType}'`);
//   }

//   if (conditions.length > 0) {
//     query += ` WHERE ${conditions.join(' AND ')}`;
//   }

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: 'Error fetching reservations' });
//     }
//     res.status(200).json({ reservations: results });
//   });
// };

exports.filterReservations = (req, res) => {
  const { customerName, transitLine } = req.query;

  // Base query
  let query = `
    SELECT 
      r.ReservationID,
      r.ReservationDate,
      c.FirstName AS CustomerFirstName,
      c.LastName AS CustomerLastName,
      ts.TransitLineName AS TransitLine,
      r.TotalFare,
      r.TripType,
      r.DepartureStation,
      r.ArrivalStation
    FROM 
      Reservation r
    JOIN 
      Customer c ON r.CustomerID = c.CustomerID
    JOIN 
      TrainSchedule ts ON r.ScheduleID = ts.ScheduleID
  `;

  // Adding conditions for filtering
  const conditions = [];
  if (customerName) {
    conditions.push(`CONCAT(c.FirstName, ' ', c.LastName) LIKE '%${customerName}%'`);
  }
  if (transitLine) {
    conditions.push(`ts.TransitLineName LIKE '%${transitLine}%'`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching reservations' });
    }
    res.status(200).json({ reservations: results });
  });
};


exports.showReservations = async (req, res) => {
  const query = `
    SELECT 
      r.ReservationID,
      r.ReservationDate,
      c.FirstName AS CustomerFirstName,
      c.LastName AS CustomerLastName,
      ts.TransitLineName AS TransitLine,
      r.TotalFare,
      r.TripType,
      r.DepartureStation,
      r.ArrivalStation
    FROM 
      Reservation r
    JOIN 
      Customer c ON r.CustomerID = c.CustomerID
    JOIN 
      TrainSchedule ts ON r.ScheduleID = ts.ScheduleID
  `;

  try {
    const [results] = await db.execute(query);
    res.json({ reservations: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching reservations.' });
  }
};

exports.getTotalRevenueByTransitLine = (req, res) => {
  const query = `
    SELECT 
      ts.TransitLineName,
      SUM(r.TotalFare) AS TotalRevenue
    FROM 
      Reservation r
    JOIN 
      TrainSchedule ts ON r.ScheduleID = ts.ScheduleID
    GROUP BY 
      ts.TransitLineName
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching revenue by transit line" });
    }
    res.status(200).json({ revenueByTransitLine: results });
  });
};

exports.getTotalRevenueByCustomer = (req, res) => {
  const query = `
    SELECT 
      c.CustomerID,
      c.FirstName,
      c.LastName,
      SUM(r.TotalFare) AS TotalRevenue
    FROM 
      Reservation r
    JOIN 
      Customer c ON r.CustomerID = c.CustomerID
    GROUP BY 
      c.CustomerID, c.FirstName, c.LastName
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching revenue by customer" });
    }
    res.status(200).json({ revenueByCustomer: results });
  });
};

exports.getTopCustomer = (req, res) => {
  const query = `
    SELECT 
      c.CustomerID,
      c.FirstName,
      c.LastName,
      SUM(r.TotalFare) AS TotalRevenue
    FROM 
      Reservation r
    JOIN 
      Customer c ON r.CustomerID = c.CustomerID
    GROUP BY 
      c.CustomerID, c.FirstName, c.LastName
    ORDER BY 
      TotalRevenue DESC
    LIMIT 1
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching top customer" });
    }
    res.status(200).json({ topCustomer: results[0] });
  });
};

// adminController.js
exports.getMostActiveTransitLines = (req, res) => {
  const query = `
    SELECT
      ts.TransitLineName AS TransitLine,
      COUNT(r.ReservationID) AS ReservationCount
    FROM
      TrainSchedule ts
    JOIN
      Reservation r ON ts.ScheduleID = r.ScheduleID
    GROUP BY
      ts.TransitLineName
    ORDER BY
      ReservationCount DESC
    LIMIT 5;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching most active transit lines" });
    }
    res.status(200).json({ transitLines: results });
  });
};
