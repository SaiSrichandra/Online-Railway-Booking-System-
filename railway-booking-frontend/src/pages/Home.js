// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to Railway Booking System</h1>
      <div className="flex-container">
        <div className="flex-item">
          <Link to="/train-search">
            <button>Search Trains</button>
          </Link>
        </div>
        <div className="flex-item">
          <Link to="/reservations">
            <button>My Reservations</button>
          </Link>
        </div>
        <div className="flex-item">
          <Link to="/faq">
            <button>FAQs</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
