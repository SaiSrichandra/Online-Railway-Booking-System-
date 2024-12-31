// routes/trainRoutes.js
const express = require("express");
const router = express.Router();
const transitLineController = require("../controllers/transitLineController");  // Controller for train actions

// Route to search for available trains based on departure and arrival stations, and dates
router.get("/", transitLineController.getTransitLines);

module.exports = router;
