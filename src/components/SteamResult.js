import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import '../styles/SteamResult.css';
import MediaQuery from 'react-responsive';
import { useNavigate } from 'react-router-dom';

export default function SteamResult({ appId, image, name, price, currency }) {

    const [ loaded, setLoaded ] = useState(false);
    const navigate = useNavigate();
    price = price ? (price / 100).toFixed(2) : "No price details available";

    return (
        <>
            <MediaQuery minWidth={769}>
                <Box
                    onClick={() => navigate(`/${appId}`)}
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
            </MediaQuery>

            <MediaQuery maxWidth={768}>
                <Box
                    onClick={() => navigate(`/${appId}`)}
                    my={1}
                    p={1}
                    sx={{ 
                        borderRadius: '15px',
                        bgcolor: '#2E2D30',
                        width: '250px',
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
                        className= {loaded ? 'preview-image-mobile' : 'load-preview'}
                        src={image}
                        alt={name}
                        onLoad={() => setLoaded(true)}
                    />
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        justifyContent="left"
                        sx={{
                            margin: '0 10px',
                        }}
                    >
                        <p className='preview-text'>
                            {name}
                        </p>

                        <p className='preview-text'>
                            {price} {currency}
                        </p>
                    </Box>
                </Box>
            </MediaQuery>

        </>
    );
}
