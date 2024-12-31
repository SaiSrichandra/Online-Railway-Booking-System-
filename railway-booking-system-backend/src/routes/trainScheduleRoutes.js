// routes/trainScheduleRoutes.js
const express = require("express");
const router = express.Router();
const trainScheduleController = require("../controllers/trainScheduleController");

// GET: List all train schedules
router.get("/", trainScheduleController.getAllTrainSchedules);
router.post("/", trainScheduleController.createTrainSchedule);
router.get("/:id", trainScheduleController.getTrainScheduleById);

module.exports = router;
