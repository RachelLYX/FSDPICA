import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
  const [pendingIndividualBookings, setPendingIndividualBookings] = useState([]);
  const [pendingGroupBookings, setPendingGroupBookings] = useState([]);

  useEffect(() => {
    fetchPendingIndividualBookings();
    fetchPendingGroupBookings();
  }, []);

  const fetchPendingIndividualBookings = () => {
    axios.get('http://localhost:3000/auth/pending_individual_bookings')
      .then(result => {
        if (result.data.Status) {
          setPendingIndividualBookings(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const fetchPendingGroupBookings = () => {
    axios.get('http://localhost:3000/auth/pending_group_bookings')
      .then(result => {
        if (result.data.Status) {
          setPendingGroupBookings(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  const handleConfirm = (id, type) => {
    const endpoint = type === 'individual' ? 'confirm_individual_booking' : 'confirm_group_booking';
    if (window.confirm('Are you sure you want to confirm this booking?')) {
      axios.post(`http://localhost:3000/auth/${endpoint}/${id}`)
        .then(result => {
          if (result.data.Status) {
            fetchPendingIndividualBookings();
            fetchPendingGroupBookings();
          } else {
            alert(result.data.Error);
          }
        })
        .catch(err => console.log(err));
    }
  };

  const handleReject = (id, type) => {
    const endpoint = type === 'individual' ? 'reject_individual_booking' : 'reject_group_booking';
    if (window.confirm('Are you sure you want to reject this booking?')) {
      axios.post(`http://localhost:3000/auth/${endpoint}/${id}`)
        .then(result => {
          if (result.data.Status) {
            fetchPendingIndividualBookings();
            fetchPendingGroupBookings();
          } else {
            alert(result.data.Error);
          }
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>Pending Individual Booking Requests</h3>
      </div>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Booking Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingIndividualBookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.event_name}</td>
                <td>{booking.name}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>
                  <button className='btn btn-success btn-sm me-2' onClick={() => handleConfirm(booking.id, 'individual')}>Confirm</button>
                  <button className='btn btn-danger btn-sm' onClick={() => handleReject(booking.id, 'individual')}>Reject</button>
                  <Link to={`/dashboard/booking_details/${booking.id}`} className='btn btn-info btn-sm ms-2'>Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='d-flex justify-content-center'>
        <h3>Pending Group Booking Requests</h3>
      </div>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Group Name</th>
              <th>Date</th>
              <th>Number of People</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingGroupBookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.event_name}</td>
                <td>{booking.group_name}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>{booking.participants}</td>
                <td>
                  <button className='btn btn-success btn-sm me-2' onClick={() => handleConfirm(booking.id, 'group')}>Confirm</button>
                  <button className='btn btn-danger btn-sm' onClick={() => handleReject(booking.id, 'group')}>Reject</button>
                  <Link to={`/dashboard/booking_details/${booking.id}`} className='btn btn-info btn-sm ms-2'>Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
