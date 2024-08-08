import React, { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'

const Rewards = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        {!isClicked ? (
            <>
                <Typography variant="h6" align="center" sx={{ mb: 3 }}>
                    Tap on the gift box to open your reward!
                </Typography>
                <Box onClick={handleClick} sx={{ cursor: 'pointer' }}>
                    <img src='./images/closed_gift_box.jpg' alt="closed gift box" style={{ width: '150px' }} />
                </Box>
            </>
        ) : (
            <>
                <Typography variant="h6" align="center" sx={{ mb: 3 }}>
                    Congratulations, you have recieved 5 grab vouchers!
                </Typography>
                <Box>
                    <img src='./images/opened_gift_box.jpg' alt="opened gift box" style={{ width: '150px' }} />
                </Box>
            </>
        )}

    </Box>
  )
}

export default Rewards