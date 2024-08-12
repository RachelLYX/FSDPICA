import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BookingDetails.css';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [isGroupBooking, setIsGroupBooking] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Try fetching individual booking first
        const individualResult = await axios.get(`http://localhost:3000/auth/individual_booking/${id}`);
        if (individualResult.data.Status) {
          setBooking(individualResult.data.Result);
        } else {
          // If not found, try fetching group booking
          const groupResult = await axios.get(`http://localhost:3000/auth/group_booking/${id}`);
          if (groupResult.data.Status) {
            setBooking(groupResult.data.Result);
            setIsGroupBooking(true);
          } else {
            alert(groupResult.data.Error);
          }
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
        alert('Error fetching booking details');
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className='booking-details'>
      <div className='details-container'>
        <h3>Booking Details</h3>
        <p><strong>Event:</strong> {booking.event_name}</p>
        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
        {isGroupBooking ? (
          <>
            <p><strong>Group Name:</strong> {booking.group_name}</p>
            <p><strong>Participants:</strong> {booking.participants}</p>
            <p><strong>Contact Name:</strong> {booking.contact_name}</p>
            <p><strong>Contact Email:</strong> {booking.contact_email}</p>
            <p><strong>Contact Phone:</strong> {booking.contact_phone}</p>
            <p><strong>Special Requirements:</strong> {booking.special_requirements}</p>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Phone:</strong> {booking.phone}</p>
            <p><strong>Special Requirements:</strong> {booking.special_requirements}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
