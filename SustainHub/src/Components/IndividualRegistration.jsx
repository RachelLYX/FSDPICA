import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './indigrpform.css';

const IndividualRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    special_requirements: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3000/auth/register_individual`, { ...formData, event_id: eventId })
      .then(result => {
        if (result.data.Status) {
          navigate('/booking-confirmation');
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="registration-form">
      <h2>Individual Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Special Requirements:</label>
          <textarea name="special_requirements" value={formData.special_requirements} onChange={handleChange}></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default IndividualRegistration;

