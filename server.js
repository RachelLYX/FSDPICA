const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let events = [
    {
        id: 1,
        title: 'Event 1',
        description: 'Desc 1',
        date: '2024-08-15',
        duration: '8 hours',
        total_spaces: 100,
        spaces_left: 50,
    },
    {
        id: 2,
        title: 'Event 2',
        description: 'Desc 2',
        date: '2024-09-10',
        duration: '3 hours',
        total_spaces: 30,
        spaces_left: 10,
    },
    {
        id: 3,
        title: 'Event 3',
        description: 'Desc 3',
        date: '2024-10-05',
        duration: '2 days',
        total_spaces: 200,
        spaces_left: 150,
    },
];

// Get all events with optional filters
app.get('/events', (req, res) => {
    const { sort, search } = req.query;
    let filteredEvents = [...events];

    if (search) {
        filteredEvents = filteredEvents.filter(event =>
            event.title.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (sort) {
        if (sort === 'alphabetical') {
            filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === 'date') {
            filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sort === 'spaces') {
            filteredEvents.sort((a, b) => a.spaces_left - b.spaces_left);
        }
    }

    res.json(filteredEvents);
});

// Get specific event details
app.get('/events/:id', (req, res) => {
    const { id } = req.params;
    const event = events.find(e => e.id === parseInt(id, 10));
    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
});

// Join an event
app.post('/events/:id/join', (req, res) => {
    const { id } = req.params;
    const event = events.find(e => e.id === parseInt(id, 10));
    if (event) {
        if (event.spaces_left > 0) {
            event.spaces_left -= 1;
            res.status(200).json({ message: 'You have successfully joined the event!', spaces_left: event.spaces_left });
        } else {
            res.status(400).json({ message: 'No spaces left for this event' });
        }
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Event Viewer Server is running on port ${PORT}`);
});


