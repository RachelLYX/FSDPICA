import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../http';

const ForumList = () => {
  const [forums, setForums] = useState([]);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await http.get('/api/forums');
        setForums(response.data);
      } catch (error) {
        console.error('Error fetching forums:', error);
      }
    };

    fetchForums();
  }, []);

return (
    <div>
        <Typography variant="h4" gutterBottom>
            Discussion Forums
        </Typography>

        {forums.length === 0 ? (
            <Box>
                <Typography variant="h6" gutterBottom>
                    No forums available yet.
                </Typography>
            </Box>
        ) : (
            <section>
                <List>
                    {forums.map((forum) => (
                        <ListItem
                            key={forum.id}
                            button
                            component={Link}
                            to={`/forum/${forum.id}`}
                        >
                            <ListItemText
                                primary={forum.title}
                                secondary={`By ${forum.username} | Upvotes: ${forum.NumberOfUpvotes}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </section>
        )}

        <Box sx={{ position: 'fixed', bottom: '20%', right: '10%' }}>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/create-forum"
            >
                Create a New Forum
            </Button>
        </Box>
    </div>
);
};

export default ForumList;
