import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import '../styles/SteamResult.css';

export default function SteamResult({ image, name, price, currency, getResponse }) {

    const [ loaded, setLoaded ] = useState(false);

    price = price ? (price / 100).toFixed(2) : "No price details available";

    return (
        <Box
            onClick={getResponse}
            my={1}
            display="flex"
            alignItems="center"
            p={1}
            sx={{ 
                borderRadius: '15px',
                bgcolor: '#2E2D30',
                width: '100%',
                '&:hover': {
                    bgcolor: '#8E8E8E',
                    cursor: 'pointer',
                },
            }}
        >
            {
                !loaded && (
                <Skeleton variant="rounded" width={231} height={87} 
                    sx={{
                        marginRight: '20px',
                    }}
                />
                )
            }
            <img
                className= {loaded ? 'preview-image' : 'load-preview'}
                src={image}
                alt={name}
                onLoad={() => setLoaded(true)}
            />
            <Box
                flex={1}
                display="flex"
                justifyContent="left"
            >
                <p className='steam-name'>
                    {name}
                </p>
            </Box>
            <Box
                flex={1}
                display="flex"
                justifyContent="right"
            >
                <p className='steam-price'>
                    {price} {currency}
                </p>
            </Box>
        </Box>
    );
}
