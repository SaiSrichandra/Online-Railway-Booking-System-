// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { verifyToken, isCustomer } = require("../middleware/authMiddleware");
const faqController = require("../controllers/faqController");
const reservationController = require("../controllers/reservationController");

// // GET: List all customers
// router.get("/", customerController.getAllCustomers);
router.post("/", customerController.createCustomer);
// router.get("/:id", customerController.getCustomerById);
// router.put("/:id", customerController.updateCustomer);
// router.delete("/:id", customerController.deleteCustomer);

// router.post("/reservation", reservationController.createReservation);
// router.get("/reservation", reservationController.getAllReservations);
// router.get("/reservation/:id", reservationController.getReservationById);

// router.get("/train-schedules", );


router.post("/signup", customerController.signup);

// Reservation routes
router.post("/reservations", verifyToken, isCustomer, customerController.createReservation);
router.get("/reservations", verifyToken, isCustomer, customerController.getReservationsByCustomer);
router.get("/reservations/history/:customerId", verifyToken, isCustomer, customerController.viewReservationHistory);
router.delete("/reservations/:reservationId", verifyToken, isCustomer, customerController.cancelReservation);
router.get("/reservations/itinerary/:reservationId", verifyToken, isCustomer, customerController.viewItinerary);
// Question routes
router.post('/questions', verifyToken, isCustomer, customerController.askQuestion);
router.get('/questions', verifyToken, isCustomer, customerController.viewAllQuestions);

// Search train schedules
router.get('/search-schedules', verifyToken, isCustomer, customerController.searchTrainSchedules);

// Profile routes
router.get('/profile/:customerId', verifyToken, isCustomer, customerController.getCustomerProfile);
router.put('/profile/:customerId', verifyToken, isCustomer, customerController.updateCustomerProfile);

// Get train schedules
router.get('/train-schedules', verifyToken, isCustomer, customerController.getTrainSchedules);

// // Get all FAQs (any user can view)
// router.get("/faqs", faqController.getFAQs);
// // Submit a new question (customers can submit)
// router.post("/questions", verifyToken, faqController.submitQuestion);
// // Admin/Representative routes to manage questions (mark as answered)
// router.put("/questions/:id/answer", verifyToken, isAdmin, faqController.answerQuestion);

router.delete('/questions/:questionId', verifyToken, isCustomer, customerController.deleteQuestion);
router.put('/questions/:questionId', verifyToken, isCustomer, customerController.editQuestion);

module.exports = router;
