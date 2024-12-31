// controllers/reservationController.js
const db = require("../models/db"); // MySQL connection

// Controller to create a reservation
exports.createReservation = (req, res) => {
  const {
    customerId,
    scheduleId,
    tripType,
    passengerType,
    totalFare,
    isRoundTrip,
    departureDateTime,
    arrivalDateTime,
    departureStation,
    arrivalStation,
  } = req.body;

  // Validate that the required fields are present
  if (!customerId || !scheduleId || !departureDateTime || !arrivalDateTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // SQL query to insert reservation into the database
  const query = `INSERT INTO Reservation 
    (ReservationDate, CustomerID, TripType, PassengerType, TotalFare, IsRoundTrip, ArrivalDateTime, DepartureDateTime, DepartureStation, ArrivalStation, ScheduleID)
    VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      customerId,
      tripType,
      passengerType,
      totalFare,
      isRoundTrip ? 1 : 0,  // Convert isRoundTrip to TINYINT (1 for true, 0 for false)
      arrivalDateTime,
      departureDateTime,
      departureStation,
      arrivalStation,
      scheduleId,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating reservation" });
      }
      res.status(201).json({ message: "Reservation created successfully", reservationId: result.insertId });
    }
  );
};

// Controller to get all reservations
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

exports.getReservationById = (req, res) => {
    const reservationId = req.params.id;
    console.log(reservationId);
    
    const query = `SELECT * FROM Reservation WHERE ReservationID = ?`;
  
    db.query(query, [reservationId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching reservation" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
      res.status(200).json({ reservation: results[0] });
    });
};


exports.getReservationsByCustomer = (req, res) => {
  const customerId = req.params.customerId;

  const query = `SELECT * FROM Reservation WHERE CustomerID = ?`;

  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching reservations" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No reservations found for this customer" });
    }

    res.status(200).json({ reservations: results });
  });
};

// // Get customers with reservations on a given transit line and date
// exports.getCustomersWithReservations = (req, res) => {
//   const { transitLineName, reservationDate } = req.query;

//   if (!transitLineName || !reservationDate) {
//     return res.status(400).json({ message: "Transit line and reservation date are required" });
//   }

//   const query = `
//     SELECT DISTINCT 
//       c.CustomerID, 
//       c.FirstName, 
//       c.LastName, 
//       r.ReservationID, 
//       r.ReservationDate, 
//       t.TransitLineName
//     FROM 
//       Reservation r
//     JOIN 
//       Customer c ON r.CustomerID = c.CustomerID
//     JOIN 
//       TrainSchedule ts ON r.ScheduleID = ts.ScheduleID
//     JOIN 
//       TransitLine t ON ts.TransitLineName = t.TransitLineName
//     WHERE 
//       t.TransitLineName = ? 
//       AND r.ReservationDate = ?;
//   `;

//   db.query(query, [transitLineName, reservationDate], (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Error fetching customers with reservations" });
//     }

//     res.status(200).json({ customers: results });
//   });
// };

// Get customers with reservations on a given transit line and date
exports.getCustomersWithReservations = (req, res) => {
  const { transitLineName, reservationDate } = req.query;

  if (!transitLineName || !reservationDate) {
    return res.status(400).json({ message: "Transit line and reservation date are required" });
  }

  const query = `
    SELECT DISTINCT 
      c.CustomerID, 
      c.FirstName, 
      c.LastName, 
      r.ReservationID, 
      r.ReservationDate,
      t.TransitLineName
    FROM 
      Reservation r
    JOIN 
      Customer c ON r.CustomerID = c.CustomerID
    JOIN 
      TrainSchedule ts ON r.ScheduleID = ts.ScheduleID
    JOIN 
      TransitLine t ON ts.TransitLineName = t.TransitLineName
    WHERE 
      t.TransitLineName = ? 
      AND (DATE(ts.ArrivalDateTime) = ? OR DATE(ts.DepartureDateTime) = ?);
  `;

  db.query(query, [transitLineName, reservationDate, reservationDate], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching customers with reservations" });
    }

    res.status(200).json({ customers: results });
  });
};
