import React from 'react';
import { Link } from 'react-router-dom';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  return (
    <div className="confirmation-page">
      <div className="confirmation-message">
        <h2>Booking Request Sent</h2>
        <p>Your booking request has been successfully sent.</p>
        <Link to="/events" className="back-link">Back to Events</Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
