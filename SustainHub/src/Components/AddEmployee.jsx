import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [booking, setBooking] = useState({
    event_name: "",
    location: "",
    date: "",
    capacity: "",
    image: null,
    event_id: "" // Added event_id field
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('event_name', booking.event_name);
      formData.append('location', booking.location);
      formData.append('date', booking.date);
      formData.append('capacity', booking.capacity);
      formData.append('image', booking.image);
      formData.append('event_id', booking.event_id); // Ensure event_id is included

      console.log('FormData:', ...formData);  // Log form data to check what's being sent

      const result = await axios.post('http://localhost:3000/auth/add_booking', formData);
      console.log('Response:', result.data);  // Log the server response

      if (result.data.Status) {
        navigate('/dashboard/employee');
      } else {
        alert(result.data.Error);
      }
    } catch (err) {
      console.error('Error during submission:', err);  // Log any errors during submission
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Booking</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="eventName" className="form-label">
              Event Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="eventName"
              placeholder="Enter Event Name"
              onChange={(e) => setBooking({ ...booking, event_name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="location"
              placeholder="Enter Location"
              onChange={(e) => setBooking({ ...booking, location: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="date"
              onChange={(e) => setBooking({ ...booking, date: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="capacity" className="form-label">
              Capacity
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="capacity"
              placeholder="Enter Capacity"
              onChange={(e) => setBooking({ ...booking, capacity: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="eventID" className="form-label">
              Event ID
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="eventID"
              placeholder="Enter Event ID"
              onChange={(e) => setBooking({ ...booking, event_id: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label htmlFor="image" className="form-label">
              Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="image"
              onChange={(e) => setBooking({ ...booking, image: e.target.files[0] })}
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
