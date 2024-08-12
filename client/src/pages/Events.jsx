import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = () => {
    axios.get('http://localhost:3000/auth/bookings')
      .then(result => {
        if (result.data.Status) {
          setEvents(result.data.Result);
        } else {
          setError(result.data.Error);
        }
      })
      .catch(err => {
        console.error(err);
        setError('Error fetching events');
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApply = (eventId) => {
    navigate(`/register/${eventId}`);
  };

  return (
    <div className="events-page">
      <h1 className="events-heading">Available Events</h1>
      {error && <div className="error">Error: {error}</div>}
      <div className="events-list">
        {events.map(event => (
          <div className="event-card" key={event.id}>
            <div className="event-image-container">
              <img className="event-image" src={`http://localhost:3000/images/${event.image}`} alt={event.event_name} />
            </div>
            <div className="event-details">
              <h2 className="event-title">{event.event_name}</h2>
              <p className="event-description">{event.description}</p>
              <p className="event-location"><strong>Location:</strong> {event.location}</p>
              <p className="event-date"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p className="event-capacity"><strong>Capacity:</strong> {event.capacity}</p>
              <button className="apply-button" onClick={() => handleApply(event.id)}>Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;



