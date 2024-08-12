import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import   './indigrpform.css'

const GroupRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    group_name: '',
    participants: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
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
    axios.post(`http://localhost:3000/auth/register_group`, { ...formData, event_id: eventId })
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
      <h2>Group Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Group Name:</label>
          <input type="text" name="group_name" value={formData.group_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Participants:</label>
          <input type="number" name="participants" value={formData.participants} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact Name:</label>
          <input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact Email:</label>
          <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact Phone:</label>
          <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} required />
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

export default GroupRegistration;



