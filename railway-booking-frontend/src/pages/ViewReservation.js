import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/my-reservations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setReservations(response.data);
      } catch (err) {
        console.error('Error fetching reservations', err);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div>
      <h2>My Reservations</h2>
      {reservations.map((reservation, index) => (
        <div key={index}>
          <p>Reservation ID: {reservation.ReservationID}</p>
          <p>Trip Type: {reservation.TripType}</p>
          <p>Total Fare: {reservation.TotalFare}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewReservations;
