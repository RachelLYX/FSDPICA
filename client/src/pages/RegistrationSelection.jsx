import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './RegistrationSelection.css'; // Optional CSS file for styling

const RegistrationSelection = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleSelection = (type) => {
    navigate(`/register/${eventId}/${type}`);
  };

  return (
    <div className="registration-selection">
      <h1>Select Registration Type</h1>
      <button onClick={() => handleSelection('individual')}>Individual Booking</button>
      <button onClick={() => handleSelection('group')}>Group Booking</button>
    </div>
  );
};

export default RegistrationSelection;
