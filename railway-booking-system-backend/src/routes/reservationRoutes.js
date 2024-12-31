// routes/reservationRoutes.js
const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

// POST: Create a new reservation
router.post("/", reservationController.createReservation);

// GET: List all reservations
router.get("/", reservationController.getAllReservations);

// routes/reservationRoutes.js
router.get("/:id", reservationController.getReservationById);

router.get("/by-customer/:customerId", reservationController.getReservationsByCustomer);



module.exports = router;
