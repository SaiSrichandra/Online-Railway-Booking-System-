// src/pages/ViewEmployees.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get('/admin/employees');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees.');
    }
  };

  return (
    <div>
      <h2>Employees List</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Username</th>
            <th>Employee Type</th>
            {/* Add more fields if available */}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.EmpID}>
              <td>{emp.EmpID}</td>
              <td>{emp.Username}</td>
              <td>{emp.EmployeeType}</td>
              {/* Add more fields if needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewEmployees;
