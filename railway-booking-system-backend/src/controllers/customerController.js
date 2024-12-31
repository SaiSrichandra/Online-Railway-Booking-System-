// // controllers/customerController.js
// const db = require("../models/db"); // MySQL connection

// // Controller to get all customers
// exports.getAllCustomers = (req, res) => {
//   const query = `SELECT * FROM Customer`;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Error fetching customers" });
//     }
//     res.status(200).json({ customers: results });
//   });
// };

// controllers/customerController.js
exports.createCustomer = (req, res) => {
    const { email, firstName, lastName, username, password } = req.body;
  
    // Validate the required fields
    if (!email || !firstName || !lastName || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // SQL query to insert a new customer into the database
    const query = `INSERT INTO Customer (Email, FirstName, LastName, Username, Password) 
      VALUES (?, ?, ?, ?, ?)`;
  
    db.query(query, [email, firstName, lastName, username, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating customer" });
      }
      res.status(201).json({ message: "Customer created successfully", customerId: result.insertId });
    });
  };

// // controllers/customerController.js
// exports.getCustomerById = (req, res) => {
//     const customerId = req.params.id;
  
//     const query = `SELECT * FROM Customer WHERE CustomerID = ?`;
  
//     db.query(query, [customerId], (err, results) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Error fetching customer" });
//       }
  
//       if (results.length === 0) {
//         return res.status(404).json({ message: "Customer not found" });
//       }
  
//       res.status(200).json({ customer: results[0] });
//     });
//   };
  
  
//   // controllers/customerController.js
// exports.updateCustomer = (req, res) => {
//     const customerId = req.params.id;
//     const { email, firstName, lastName, username, password } = req.body;
  
//     // Validate that the required fields are present
//     if (!email || !firstName || !lastName || !username || !password) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }
  
//     // SQL query to update customer details
//     const query = `UPDATE Customer 
//       SET Email = ?, FirstName = ?, LastName = ?, Username = ?, Password = ? 
//       WHERE CustomerID = ?`;
  
//     db.query(query, [email, firstName, lastName, username, password, customerId], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Error updating customer" });
//       }
  
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "Customer not found" });
//       }
  
//       res.status(200).json({ message: "Customer updated successfully" });
//     });
//   };
  
//   // controllers/customerController.js
// exports.deleteCustomer = (req, res) => {
//     const customerId = req.params.id;
  
//     // SQL query to delete customer by ID
//     const query = `DELETE FROM Customer WHERE CustomerID = ?`;
  
//     db.query(query, [customerId], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Error deleting customer" });
//       }
  
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "Customer not found" });
//       }
  
//       res.status(200).json({ message: "Customer deleted successfully" });
//     });
//   };
  
const db = require("../models/db");


// Signup API for customers
exports.signup = (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  if (!firstName || !lastName || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `INSERT INTO Customer (FirstName, LastName, Username, Password) VALUES (?, ?, ?, ?)`;

  db.query(query, [firstName, lastName, username, password], (err, result) => {
    if (err) {
      console.error("Error during signup:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(201).json({ message: "Customer created successfully" });
  });
};

// Create a reservation
exports.createReservation = (req, res) => {
  const { customerId, transitLineName, originStation, destinationStation, travelDate, tripType, isRoundTrip, passengerType, trainId } = req.body;

  if (!customerId || !transitLineName || !originStation || !destinationStation || !travelDate || !tripType || !trainId) {
    return res.status(400).json({ error: "All reservation details are required" });
  }

  // Fetch train details and calculate fare dynamically
  const trainQuery = `
    SELECT BaseFare, Stops 
    FROM TransitLine 
    WHERE TransitLineName = ?`;

  db.query(trainQuery, [transitLineName], (err, trainResult) => {
    if (err) {
      console.error("Error fetching train details:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (trainResult.length === 0) {
      return res.status(404).json({ error: "Transit line not found" });
    }

    const { BaseFare, Stops } = trainResult[0];
    const stopFare = BaseFare / Stops;

    // Calculate fare based on the number of stops between origin and destination
    const stopsQuery = `
      SELECT COUNT(*) AS stopCount 
      FROM Stop 
      WHERE TransitLineName = ? 
      AND StationID BETWEEN 
        (SELECT StationID FROM Station WHERE StationName = ?) 
        AND 
        (SELECT StationID FROM Station WHERE StationName = ?)`;

    db.query(stopsQuery, [transitLineName, originStation, destinationStation], (err, stopResult) => {
      if (err) {
        console.error("Error calculating stops:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const { stopCount } = stopResult[0];
      let fare = stopCount * stopFare;

      // Apply discounts based on passenger type
      if (passengerType === "child") fare *= 0.75;
      if (passengerType === "senior") fare *= 0.65;
      if (passengerType === "disabled") fare *= 0.50;

      // Adjust for round-trip
      if (isRoundTrip) fare *= 2;

      // Insert the reservation
      const reservationQuery = `
        INSERT INTO Reservation (CustomerID, DepartureStation, ArrivalStation, DepartureDateTime, ArrivalDateTime, TripType, IsRoundTrip, TotalFare, trainId, passengerType) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(
        reservationQuery,
        [customerId, originStation, destinationStation, travelDate, travelDate, tripType, isRoundTrip, fare, trainId, passengerType],
        (err, result) => {
          if (err) {
            console.error("Error creating reservation:", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          res.status(201).json({
            message: "Reservation created successfully",
            reservationId: result.insertId,
            fare: fare.toFixed(2),
          });
        }
      );
    });
  });
};


// View reservation history for a customer
exports.viewReservationHistory = (req, res) => {
  const customerId = req.params.customerId;

  const query = `SELECT * FROM Reservation WHERE CustomerID = ? ORDER BY TravelDate DESC`;

  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error("Error fetching reservation history:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({ reservations: results });
  });
};

// Cancel a reservation
exports.cancelReservation = (req, res) => {
  const reservationId = req.params.reservationId;

  const query = `DELETE FROM Reservation WHERE ReservationID = ?`;

  db.query(query, [reservationId], (err, result) => {
    if (err) {
      console.error("Error cancelling reservation:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    res.status(200).json({ message: "Reservation cancelled successfully" });
  });
};

// View itinerary for a reservation
// exports.viewItinerary = (req, res) => {
//   const reservationId = req.params.reservationId;

//   const query = `SELECT * FROM Reservation WHERE ReservationID = ?`;

//   db.query(query, [reservationId], (err, results) => {
//     if (err) {
//       console.error("Error fetching itinerary:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "Reservation not found" });
//     }

//     res.status(200).json({ itinerary: results[0] });
//   });
// };

// customerController.js
// exports.viewItinerary = (req, res) => {
//   const { reservationId } = req.params;

//   const query = `
//     SELECT r.ReservationID, r.TripType, r.PassengerType, r.TotalFare, 
//            r.DepartureStation, r.ArrivalStation, r.DepartureDateTime, r.ArrivalDateTime, 
//            t.TrainID, t.TrainName
//     FROM Reservation r
//     JOIN TrainSchedule ts ON r.ScheduleID = ts.ScheduleID
//     JOIN Train t ON ts.TrainID = t.TrainID
//     WHERE r.ReservationID = ?`;

//   db.query(query, [reservationId], (err, results) => {
//     if (err) {
//       console.error("Error fetching itinerary:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "Reservation not found" });
//     }

//     res.status(200).json({ itinerary: results[0] });
//   });
// };

// Controller: View Travel Itinerary for a Reservation
exports.viewItinerary = (req, res) => {
  const { reservationId } = req.params; // Extract reservationId from request params

  if (!reservationId) {
    return res.status(400).json({ error: "Reservation ID is required" });
  }

  // SQL query to fetch the itinerary details
  const query = `
    SELECT 
      r.ReservationID, 
      r.TripType, 
      r.PassengerType, 
      r.TotalFare, 
      r.DepartureStation, 
      r.ArrivalStation, 
      r.DepartureDateTime, 
      r.ArrivalDateTime, 
      r.TrainID
    FROM Reservation r
    WHERE r.ReservationID = ?;
  `;

  db.query(query, [reservationId], (err, results) => {
    if (err) {
      console.error("Error fetching travel itinerary:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No itinerary found for this reservation ID" });
    }

    res.status(200).json({ itinerary: results[0] });
  });
};

// Ask a question
exports.askQuestion = (req, res) => {
  const { customerId, questionText } = req.body;

  if (!customerId || !questionText) {
    return res.status(400).json({ error: "Customer ID and question are required" });
  }

  const query = `INSERT INTO Question (CustomerID, Question, Timestamp, IsAnswered) VALUES (?, ?, NOW(), 0)`;

  db.query(query, [customerId, questionText], (err, result) => {
    if (err) {
      console.error("Error asking question:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(201).json({ message: "Question submitted successfully" });
  });
};

// Search train schedules based on origin, destination, and date
// exports.searchTrainSchedules = (req, res) => {
//   const { origin, destination, travelDate } = req.query;

//   if (!origin || !destination || !travelDate) {
//     return res.status(400).json({ error: "Origin, destination, and travel date are required" });
//   }

//   const query = `
//     SELECT ts.ScheduleID, ts.TransitLineName, ts.ArrivalDateTime, ts.DepartureDateTime, ts.TrainID
//     FROM TrainSchedule ts
//     JOIN Station s1 ON ts.OriginStationID = s1.StationID
//     JOIN Station s2 ON ts.DestinationStationID = s2.StationID
//     WHERE s1.StationName = ? AND s2.StationName = ? AND DATE(ts.DepartureDateTime) = ?
//   `;

//   db.query(query, [origin, destination, travelDate], (err, results) => {
//     if (err) {
//       console.error("Error searching train schedules:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     res.status(200).json({ trainSchedules: results });
//   });
// };
exports.searchTrainSchedules = (req, res) => {
  const { originStation, destinationStation, travelDate } = req.query;

  const query = `
    SELECT ts.ScheduleID, ts.TransitLineName, ts.DepartureDateTime, ts.ArrivalDateTime, t.TrainID
    FROM TrainSchedule ts
    JOIN Train t ON ts.TrainID = t.TrainID
    WHERE ts.DepartureStation = ? AND ts.ArrivalStation = ? AND DATE(ts.DepartureDateTime) = ?;
  `;

  db.query(query, [originStation, destinationStation, travelDate], (err, results) => {
    if (err) {
      console.error("Error fetching schedules:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({ trainSchedules: results });
  });
};


exports.getCustomerProfile = (req, res) => {
  const { customerId } = req.params;

  const query = 'SELECT * FROM Customer WHERE CustomerID = ?';
  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching customer profile:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({ profile: results[0] });
  });
};

// Update customer profile
exports.updateCustomerProfile = (req, res) => {
  const { customerId } = req.params;
  const { email, firstName, lastName, username, password } = req.body;

  const query = `
    UPDATE Customer SET 
      Email = ?,
      FirstName = ?,
      LastName = ?,
      Username = ?,
      Password = ?
    WHERE CustomerID = ?
  `;

  db.query(query, [email, firstName, lastName, username, password, customerId], (err, results) => {
    if (err) {
      console.error('Error updating customer profile:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json({ message: 'Customer profile updated successfully' });
  });
};

// View all questions asked by the customer
// exports.viewAllQuestions = (req, res) => {
//   const { customerId } = req.query; // Assuming customer ID is in token payload

//   const query = 'SELECT * FROM Question WHERE CustomerID = ?';
//   db.query(query, [customerId], (err, results) => {
//     if (err) {
//       console.error('Error fetching questions:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     res.status(200).json({ questions: results });
//   });
// };

exports.viewAllQuestions = (req, res) => {
  const query = 'SELECT * FROM Question';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching questions:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json({ questions: results });
  });
};


exports.getTrainSchedules = (req, res) => {
  const query = 'SELECT * FROM TrainSchedule';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching train schedules:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json({ trainSchedules: results });
  });
};

// Get all reservations by customer
exports.getReservationsByCustomer = (req, res) => {
  const { customerId } = req.query; // Assuming customer ID is in token payload

  console.log(customerId);
  const query = 'SELECT * FROM Reservation WHERE CustomerID = ?';
  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error('Error fetching reservations:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json({ reservations: results });
  });
};

// Delete a question
exports.deleteQuestion = (req, res) => {
  const { questionId } = req.params;

  const query = 'DELETE FROM Question WHERE QuestionID = ?';
  db.query(query, [questionId], (err, result) => {
    if (err) {
      console.error('Error deleting question:', err);
      return res.status(500).json({ error: 'Failed to delete question' });
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  });
};

// Edit a question
exports.editQuestion = (req, res) => {
  const { questionId } = req.params;
  const { updatedQuestion } = req.body;

  const query = 'UPDATE Question SET Question = ? WHERE QuestionID = ?';
  db.query(query, [updatedQuestion, questionId], (err, result) => {
    if (err) {
      console.error('Error updating question:', err);
      return res.status(500).json({ error: 'Failed to update question' });
    }
    res.status(200).json({ message: 'Question updated successfully' });
  });
};