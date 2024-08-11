import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const VolunteerPrograms = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6" gutterBottom>
            View your available programs or sign up for one to save mother earth!
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button component={Link} to="/addactivity" variant="contained" color="primary">Sign up for a new program</Button>
            <Button component={Link} to="/volunteering" variant="contained" color="primary">View available programs</Button>
        </Box>
    </Box>
  )
}

export default VolunteerPrograms