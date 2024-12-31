const express = require("express");
const router = express.Router();
const { verifyToken, isCustomerRep } = require("../middleware/authMiddleware");
const trainScheduleController = require("../controllers/trainScheduleController");
const faqController = require("../controllers/faqController");
const reservationController = require("../controllers/reservationController");
const trainController = require("../controllers/trainController");

// Train Schedule Management for Customer Representatives
router.get("/train-schedules", verifyToken, isCustomerRep, trainScheduleController.getAllTrainSchedules); 
router.post("/train-schedules", verifyToken, isCustomerRep, trainScheduleController.addTrainSchedule);
router.put("/train-schedules/:id", verifyToken, isCustomerRep, trainScheduleController.updateTrainSchedule);
router.delete("/train-schedules/:id", verifyToken, isCustomerRep, trainScheduleController.deleteTrainSchedule);
router.get('/train-schedules/station',verifyToken, isCustomerRep , trainScheduleController.getSchedulesForStation);

router.get("/faqs", verifyToken, isCustomerRep ,faqController.getFAQs);
// router.get("/questions", verifyToken, isCustomerRep, faqController.submitQuestion);
// Get all unanswered questions (for representatives)
router.get("/questions/unanswered", verifyToken, isCustomerRep, faqController.getUnansweredQuestions);
router.put("/questions/:id/answer", verifyToken, isCustomerRep, faqController.answerQuestion);

// Get customers based on transit line and reservation date
router.get("/customers/reservations", verifyToken, isCustomerRep, reservationController.getCustomersWithReservations);

// In customerRepRoutes.js or appropriate router file
router.get("/schedules-by-station", verifyToken, isCustomerRep, trainScheduleController.getSchedulesForStation);

router.get('/trains', trainController.getAllTrains);



module.exports = router;

