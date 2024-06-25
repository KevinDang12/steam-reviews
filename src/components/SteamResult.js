import React from 'react';
import Box from '@mui/material/Box';

export default function SteamResult({ image, name, price, currency, getResponse }) {

    price = price ? (price / 100).toFixed(2) : "No price details available";

    return (
        <Box
            onClick={getResponse}
            my={2}
            display="flex"
            alignItems="center"
            p={1}
            sx={{ 
                borderRadius: '15px',
                bgcolor: '#2E2D30',
                '&:hover': {
                    bgcolor: '#8E8E8E',
                    cursor: 'pointer',
                },
            }}
        >
            <img 
                src={image}
                alt={name}
                style={{
                    marginRight: '20px',
                    borderRadius: '15px',
                }}/>
            <Box
                flex={1}
                display="flex"
                justifyContent="left"
            >
                <p 
                    style={{
                        textAlign: 'left',
                        margin: 0,
                        color: 'white',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {name}
                </p>
            </Box>
            <Box
                flex={1}
                display="flex"
                justifyContent="right"
            >
                <p
                    style={{
                        textAlign: 'right',
                        margin: 0,
                        marginRight: '20px',
                        color: 'white',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {price} {currency}
                </p>
            </Box>
        </Box>
    );
}
