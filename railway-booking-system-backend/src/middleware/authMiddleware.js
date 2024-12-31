// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  // Check for token in Authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(403).json({ message: "Access denied, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access denied, invalid token format" });
  }

  try {
    // Verify the token using the secret stored in .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user info to the request object
    req.user = decoded;
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();  // Proceed to the next middleware or route handler if the user is an admin
};

exports.isCustomerRep = (req, res, next) => {
  if (req.user.role !== "Staff") {
    return res.status(403).json({ message: "Access denied, customer representative only" });
  }
  next();
};

exports.isCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "User does not exist. Please sign up" });
  }
  next();
};