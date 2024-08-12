import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

const EditBooking = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState({
    event_name: "",
    location: "",
    date: "",
    capacity: "",
    image: null,
    existingImage: "", // Store existing image filename
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/auth/bookings/${id}`)
      .then(result => {
        if (result.data.Status) {
          const bookingData = result.data.Result[0];
          setBooking({
            event_name: bookingData.event_name || "",
            location: bookingData.location || "",
            date: moment(bookingData.date).format("YYYY-MM-DD") || "",
            capacity: bookingData.capacity || "",
            existingImage: bookingData.image || "",
          });
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('event_name', booking.event_name || '');
    formData.append('location', booking.location || '');
    formData.append('date', booking.date || '');
    formData.append('capacity', booking.capacity || '');
    if (booking.image) {
      formData.append('image', booking.image);
    } else {
      formData.append('existingImage', booking.existingImage);
    }

    axios.put(`http://localhost:3000/auth/edit_booking/${id}`, formData)
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/employee');
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Booking</h3>
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
              value={booking.event_name}
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
              value={booking.location}
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
              value={booking.date}
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
              value={booking.capacity}
              onChange={(e) => setBooking({ ...booking, capacity: e.target.value })}
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
              Edit Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBooking;

