// routes/faqRoutes.js
const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");  // Controller for FAQ actions
const { verifyToken, isAdmin, isRepresentative } = require("../middleware/authMiddleware");  // Middleware for role checks

// Get all FAQs (any user can view)
router.get("/faqs", faqController.getFAQs);

// Submit a new question (customers can submit)
router.post("/questions", verifyToken, faqController.submitQuestion);

// Admin/Representative routes to manage questions (mark as answered)
router.put("/questions/:id/answer", verifyToken, isAdmin, faqController.answerQuestion);

module.exports = router;
