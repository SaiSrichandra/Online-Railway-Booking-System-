import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const RevenueTab = () => {
  const [revenueByTransitLine, setRevenueByTransitLine] = useState([]);
  const [revenueByCustomer, setRevenueByCustomer] = useState([]);
  const [topCustomer, setTopCustomer] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all the revenue data when the component loads
    fetchRevenueByTransitLine();
    fetchRevenueByCustomer();
    fetchTopCustomer();
  }, []);

  const fetchRevenueByTransitLine = async () => {
    try {
      const response = await axiosInstance.get('/admin/revenue/transit-line');
      setRevenueByTransitLine(response.data.revenueByTransitLine);
      setError('');
    } catch (err) {
      console.error('Error fetching revenue by transit line:', err);
      setError('Failed to fetch revenue by transit line.');
    }
  };

  const fetchRevenueByCustomer = async () => {
    try {
      const response = await axiosInstance.get('/admin/revenue/customer');
      setRevenueByCustomer(response.data.revenueByCustomer);
      setError('');
    } catch (err) {
      console.error('Error fetching revenue by customer:', err);
      setError('Failed to fetch revenue by customer.');
    }
  };

  const fetchTopCustomer = async () => {
    try {
      const response = await axiosInstance.get('/admin/revenue/top-customer');
      setTopCustomer(response.data.topCustomer);
      setError('');
    } catch (err) {
      console.error('Error fetching top customer:', err);
      setError('Failed to fetch the top customer.');
    }
  };

  return (
    <div>
      <h2>Revenue</h2>
      {error && <p className="error">{error}</p>}

      <div style={{ marginBottom: '20px' }}>
        <h3>Total Revenue by Transit Line</h3>
        <table>
          <thead>
            <tr>
              <th>Transit Line</th>
              <th>Total Revenue ($)</th>
            </tr>
          </thead>
          <tbody>
            {revenueByTransitLine.map((line) => (
              <tr key={line.TransitLineName}>
                <td>{line.TransitLineName}</td>
                <td>${line.TotalRevenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Total Revenue by Customer</h3>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total Revenue ($)</th>
            </tr>
          </thead>
          <tbody>
            {revenueByCustomer.map((customer) => (
              <tr key={customer.CustomerID}>
                <td>{customer.FirstName} {customer.LastName}</td>
                <td>${customer.TotalRevenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Top Customer</h3>
        {topCustomer ? (
          <p>
            {topCustomer.FirstName} {topCustomer.LastName} generated the most revenue of ${topCustomer.TotalRevenue.toFixed(2)}.
          </p>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default RevenueTab;
