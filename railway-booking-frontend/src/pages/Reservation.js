// src/pages/Reservation.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reservation = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/my-reservations', {
          headers: { Authorization: 'Bearer YOUR_JWT_TOKEN' }
        });
        setReservations(response.data.reservations);
      } catch (error) {
        console.error('Error fetching reservations', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <h1>My Reservations</h1>
      {reservations.length > 0 ? (
        reservations.map((reservation, index) => (
          <div key={index}>
            <p>Reservation ID: {reservation.ReservationID}</p>
            <p>Trip Type: {reservation.TripType}</p>
            <p>Total Fare: {reservation.TotalFare}</p>
          </div>
        ))
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );
};

export default Reservation;
