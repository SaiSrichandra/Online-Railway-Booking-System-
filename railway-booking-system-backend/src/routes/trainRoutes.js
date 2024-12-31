// routes/trainRoutes.js
const express = require("express");
const router = express.Router();
const trainController = require("../controllers/trainController");  // Controller for train actions

// Route to search for available trains based on departure and arrival stations, and dates
router.get("/search", trainController.searchTrains);

// router.get('/', trainController.getAllTrains);

module.exports = router;
