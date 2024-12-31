// routes/protectedRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

// A protected route that requires authentication
router.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "You have access to this route", user: req.user });
});

module.exports = router;
