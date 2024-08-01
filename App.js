import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [events, setEvents] = useState([]);
    const [sort, setSort] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchEvents();
    }, [sort, search]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:3003/events', {
                params: { sort, search },
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events", error);
        }
    };

    const handleJoin = async (id) => {
        try {
            const response = await axios.post(`http://localhost:3003/events/${id}/join`);
            alert(response.data.message);
            setEvents(events.map(event =>
                event.id === id ? { ...event, spaces_left: response.data.spaces_left } : event
            ));
        } catch (error) {
            console.error("Error joining event", error);
            if (error.response) {
                alert(error.response.data.message);
            }
        }
    };

    return (
        <div>
            <h1>Event Viewer</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select onChange={(e) => setSort(e.target.value)} value={sort}>
                    <option value="">Sort By</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="date">Date</option>
                    <option value="spaces">Spaces Left</option>
                </select>
            </div>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>
                        <p>Date: {event.date}</p>
                        <p>Duration: {event.duration}</p>
                        <p>Spaces Left: {event.spaces_left}/{event.total_spaces}</p>
                        <button onClick={() => handleJoin(event.id)}>Join Event</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
