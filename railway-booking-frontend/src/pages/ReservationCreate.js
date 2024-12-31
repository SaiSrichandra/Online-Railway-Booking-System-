import React, { useState } from 'react';
import axios from 'axios';

const ReservationCreate = () => {
  const [trainId, setTrainId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [tripType, setTripType] = useState('Round-Trip');
  const [fare, setFare] = useState(0);

  const handleCreateReservation = async () => {
    try {
      await axios.post('http://localhost:3000/api/reservations', {
        customerId,
        trainId,
        tripType,
        totalFare: fare
      });
      alert('Reservation created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating reservation');
    }
  };

  return (
    <div>
      <h2>Create Reservation</h2>
      <input 
        type="number" 
        placeholder="Train ID" 
        value={trainId} 
        onChange={(e) => setTrainId(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Customer ID" 
        value={customerId} 
        onChange={(e) => setCustomerId(e.target.value)} 
      />
      <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
        <option value="Round-Trip">Round Trip</option>
        <option value="One-Way">One Way</option>
      </select>
      <input 
        type="number" 
        placeholder="Total Fare" 
        value={fare} 
        onChange={(e) => setFare(e.target.value)} 
      />
      <button onClick={handleCreateReservation}>Create Reservation</button>
    </div>
  );
};

export default ReservationCreate;
