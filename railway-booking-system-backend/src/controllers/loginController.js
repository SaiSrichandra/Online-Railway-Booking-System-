const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

// Controller for employee login (authentication)
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Query for Employee first
  let query = `SELECT EmpID AS userId, Username, Password, EmployeeType AS role FROM Employee WHERE Username = ?;`;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error in employee login query:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      const employee = results[0];
      const passwordMatch = (password === employee.Password); // Direct comparison as requested

      if (passwordMatch) {
        // Generate JWT token for Employee
        const token = jwt.sign(
          { id: employee.userId, username: employee.Username, role: employee.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" } // Token valid for 1 hour
        );

        return res.status(200).json({
          token,
          role: employee.role,
        });
      } else {
        return res.status(401).json({ error: "Invalid username or password" });
      }
    }

    // If not found in Employee table, try Customer table
    query = `SELECT CustomerID AS userId, Username, Password, 'customer' AS role FROM Customer WHERE Username = ?;`;

    db.query(query, [username], (err, results) => {
      if (err) {
        console.error("Error in customer login query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length > 0) {
        const customer = results[0];
        const passwordMatch = (password === customer.Password); // Direct comparison as requested

        if (passwordMatch) {
          // Generate JWT token for Customer
          const token = jwt.sign(
            { id: customer.userId, username: customer.Username, role: customer.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token valid for 1 hour
          );

          return res.status(200).json({
            token,
            role: customer.role,
            id: customer.userId
          });
        } else {
          return res.status(401).json({ error: "Invalid username or password" });
        }
      }

      // No user found in either table
      return res.status(401).json({ error: "Invalid username or password" });
    });
  });
};
