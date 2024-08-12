import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/bookings")
      .then((result) => {
        if (result.data.Status) {
          setBookings(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this booking?");
    if (confirmed) {
      axios.delete(`http://localhost:3000/auth/delete_booking/${id}`)
        .then(result => {
          if (result.data.Status) {
            setBookings(bookings.filter(booking => booking.id !== id)); // Update state to remove the deleted booking
          } else {
            alert(result.data.Error);
          }
        })
        .catch(err => console.log(err));
    }
  };

  const filteredBookings = bookings.filter(
    booking =>
      booking.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Bookings List</h3>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <Link to="/dashboard/add_employee" className="btn btn-success">
          Add Booking
        </Link>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by event name or location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>Capacity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.event_name}</td>
                <td>{booking.location}</td>
                <td>{booking.date}</td>
                <td>{booking.capacity}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/${booking.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(booking.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && (
          <div className="text-center mt-3">
            <p>No bookings found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
