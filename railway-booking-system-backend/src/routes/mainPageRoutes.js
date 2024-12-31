const express = require("express");
const router = express.Router();
const mainPageController = require("../controllers/mainPageController");

router.get("/train-schedules", mainPageController.searchTrainSchedules);
// router.get("/trains/:trainID/details", mainPageController.getTrainDetails);
router.get("/train-schedules/:scheduleID/stops", mainPageController.getStopsByScheduleID);

module.exports = router;