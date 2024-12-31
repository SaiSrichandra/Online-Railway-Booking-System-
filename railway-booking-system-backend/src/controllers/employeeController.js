// controllers/employeeController.js
const db = require("../models/db"); // MySQL connection

// Controller to get all employees
exports.getAllEmployees = (req, res) => {
  const query = `SELECT * FROM Employee`;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching employees" });
    }
    res.status(200).json({ employees: results });
  });
};


exports.createEmployee = (req, res) => {
    const { ssn, firstName, lastName, username, password, employeeType } = req.body;
  
    // Validate that the required fields are present
    if (!ssn || !firstName || !lastName || !username || !password || !employeeType) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // SQL query to insert a new employee
    const query = `INSERT INTO Employee (SSN, FirstName, LastName, Username, Password, EmployeeType) 
      VALUES (?, ?, ?, ?, ?, ?)`;
  
    db.query(query, [ssn, firstName, lastName, username, password, employeeType], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error creating employee" });
      }
      res.status(201).json({ message: "Employee created successfully", empId: result.insertId });
    });
  };  


exports.getEmployeeById = (req, res) => {
    const empId = req.params.id;
  
    const query = `SELECT * FROM Employee WHERE EmpID = ?`;
  
    db.query(query, [empId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching employee" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      res.status(200).json({ employee: results[0] });
    });
  };


// controllers/employeeController.js
exports.updateEmployee = (req, res) => {
    const empId = req.params.id;
    const { ssn, firstName, lastName, username, password, employeeType } = req.body;
  
    // Validate that the required fields are present
    if (!ssn || !firstName || !lastName || !username || !password || !employeeType) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // SQL query to update employee details
    const query = `UPDATE Employee 
      SET SSN = ?, FirstName = ?, LastName = ?, Username = ?, Password = ?, EmployeeType = ? 
      WHERE EmpID = ?`;
  
    db.query(query, [ssn, firstName, lastName, username, password, employeeType, empId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating employee" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      res.status(200).json({ message: "Employee updated successfully" });
    });
  };
  

// controllers/employeeController.js
exports.deleteEmployee = (req, res) => {
    const empId = req.params.id;
  
    // SQL query to delete employee by ID
    const query = `DELETE FROM Employee WHERE EmpID = ?`;
  
    db.query(query, [empId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error deleting employee" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      res.status(200).json({ message: "Employee deleted successfully" });
    });
  };
