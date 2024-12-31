// src/pages/ViewCustomers.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/admin/customers');
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to fetch customers.');
    }
  };

  return (
    <div>
      <h2>Customers List</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            {/* Add more fields if available */}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.CustomerID}>
              <td>{customer.CustomerID}</td>
              <td>{customer.FirstName}</td>
              <td>{customer.LastName}</td>
              <td>{customer.Email}</td>
              {/* Add more fields if needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCustomers;
