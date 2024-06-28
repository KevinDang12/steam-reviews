import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

export default function SteamRating({ value }) {  
    return (
      <Box
        sx={{
          margin: '10px 15px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Rating
          name="text-feedback"
          value={value / 2}
          readOnly
          precision={0.5}
          emptyIcon={<StarIcon sx={{ opacity: 1, color: '#FFF5', }} fontSize="inherit" />}
          sx={{
            '& .MuiRating-iconFilled': {
              color: 'lightBlue',
            },
          }}
        />
      </Box>
    );
}
