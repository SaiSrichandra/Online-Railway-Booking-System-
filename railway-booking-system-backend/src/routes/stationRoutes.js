const express = require("express");
const router = express.Router();

const stationController = require("../controllers/stationController");

// Get all stations
router.get("/", stationController.getAllStation);

// Create a station
router.post("/", stationController.createStation);

module.exports = router;

