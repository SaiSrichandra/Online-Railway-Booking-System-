const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");
const employeeController = require("../controllers/employeeController");

// Admin routes for managing reservations
router.post("/payment", verifyToken, isAdmin, adminController.processPayment);

router.get("/transit-lines", verifyToken, isAdmin, adminController.getTransitLines);

// adminRoutes.js
router.get("/reservations", verifyToken, isAdmin, adminController.filterReservations);

// Admin routes for managing customers
router.get("/customers", verifyToken, isAdmin, adminController.getAllCustomers);

// Admin routes to get sales report
router.get("/sales-report", verifyToken, isAdmin, adminController.getSalesReport);

// Admin routes for managing employees
router.get("/employees", verifyToken, isAdmin, employeeController.getAllEmployees);
router.post("/employees", verifyToken, isAdmin, employeeController.createEmployee);
router.get("/employees/:id", verifyToken, isAdmin, employeeController.getEmployeeById);
router.put("/employees/:id", verifyToken, isAdmin, employeeController.updateEmployee);
router.delete("/employees/:id", verifyToken, isAdmin, employeeController.deleteEmployee);

router.get("/revenue/transit-line", verifyToken, isAdmin, adminController.getTotalRevenueByTransitLine);
// Get total revenue by customer
router.get("/revenue/customer", verifyToken, isAdmin, adminController.getTotalRevenueByCustomer);
router.get("/revenue/top-customer", verifyToken, isAdmin, adminController.getTopCustomer);
router.get("/most-active-transit-lines", verifyToken, isAdmin, adminController.getMostActiveTransitLines);

module.exports = router;
