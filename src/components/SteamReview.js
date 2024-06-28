import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import SteamRating from './SteamRating';
import Divider from '@mui/material/Divider';
import he from 'he';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { textStyles } from '../styles/textStyles';
import '../styles/SteamReview.css';
import LoadingBar from './LoadingBar';
import InfoDialog from './InfoDialog';

export default function SteamReview({ appId, result, response, setResponse, setShowReview, country }) {

    const [ previousReview, setPreviousReview ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ review, setReview ] = useState(result);
    const [ infoOpen, setInfoOpen ] = useState(false);

    function redirectToStore(appId) {
        window.open(`https://store.steampowered.com/app/${appId}`);
    }

    async function getResponse(appId) {
        setLoading(true);
        let steamReview = await axios.get(`${process.env.REACT_APP_URL}/api/gamedetails/${appId}?country=${country}`);
        setReview(steamReview.data);
        setShowReview(true);
        setLoading(false);
        const response = await axios.get(`${process.env.REACT_APP_URL}/api/reviews/${appId}?country=${country}`);
        setResponse(response.data);
    }

    function getReviews() {
        setPreviousReview(true);
        setResponse([]);
        getResponse(review.full_game.appid);
    }

    function onBackClick() {
        if (previousReview) {
            getResponse(appId);
            setPreviousReview(false);
            setResponse([]);
        } else {
            setShowReview(false);
            setResponse([]);
        }
    }

    return (
        <>
            {
                loading ?
                <div className='loading-bar-container'>
                    <LoadingBar />
                </div> :
                <Box
                    my={2}
                    display="flex"
                    flexDirection='column'
                    alignItems="left"
                    p={2}
                    sx={{ 
                        borderRadius: '15px',
                        bgcolor: '#2E2D30',
                    }}
                >
                    <IconButton
                        size="large"
                        sx={{
                            margin: '10px auto 0 0',
                            color: 'white',
                            ":hover": {
                                bgcolor: 'grey',
                            }
                        }}
                        onClick={onBackClick}
                        >
                        <ArrowBackIcon />
                    </IconButton>
                    <h1 className='steam-name'>
                        {review.name}
                    </h1>
                    <img
                        className='steam-image'
                        src={review.image}
                        alt={review.name}
                    />
                    {
                        review.type === 'dlc' ? 
                        <Box
                            sx={{
                                padding: '5px 10px',
                                margin: '15px',
                                borderRadius: '5px',
                                backgroundColor: '#864996',
                            }}    
                        >
                            <h3 className='steam-dlc'>
                                DLC
                            </h3>
                            <p className='dlc-description'>Click <u
                                className='clickable-text' 
                                onClick={getReviews}
                                >
                                here
                            </u> to see the review for the base game</p>
                        </Box>
                        : null
                    }
                    {
                        review.genres.length <= 0 ? null :
                        <>
                            <p className='section-header'>
                                GENRE
                            </p>
                            <Divider
                                variant="middle"
                                component="p"
                                sx={{ bgcolor: 'white'}}
                            />
                            <Box
                                display="flex"
                                alignItems="center"
                                sx={{
                                    flexWrap: 'wrap',
                                    margin: '0 10px 10px 10px'
                                }}
                            >
                                {
                                    review.genres.map((genre, index) => {
                                        return (
                                            <Box
                                                key={index}
                                                sx={{
                                                    bgcolor: 'grey',
                                                    borderRadius: '5px',
                                                    margin: '10px',
                                                    '&:hover': {
                                                        bgcolor: 'darkGrey',
                                                        cursor: 'pointer',
                                                    },
                                                }}
                                            >
                                                <p className='genre'key={index}>
                                                    {genre}
                                                </p>
                                            </Box>
                                        );
                                    })
                                }
                            </Box>
                        </>
                    }
                    <p className='section-header'>
                        ABOUT THIS GAME
                    </p>
                    <Divider
                        variant="middle"
                        component="p"
                        sx={{ bgcolor: 'white', marginBottom: '5px' }}
                    />
                    <p className='review-description'>
                        {he.decode(review.description)}
                    </p>
                    <p className='section-header'>
                        RECENT REVIEWS
                    </p>
                    <Divider
                        variant="middle"
                        component="p"
                        sx={{ bgcolor: 'white' }}
                    />
                    <Box
                        display="flex"
                        alignItems="left"
                        sx={{
                            margin: '0 0 10px 0',
                        }}
                    >
                        <SteamRating value={review.review_score} />
                        <p className='score'>
                            {review.review_score}/10
                        </p>
                        <p className='overall-review'>
                            {review.review_description}
                        </p>
                    </Box>
                    <Box
                        display="flex"
                        alignItems="left"
                    >
                        <p className='price-header'>
                            PRICE
                        </p>
                        <p className='release-header'>
                            RELEASE DATE
                        </p>
                    </Box>
                    <Box
                        display="flex"
                        alignItems="left"
                        sx={{
                            margin: '0 0 10px 0',
                        }}
                    >
                        <p className='price'>
                            {review.price}
                        </p>
                        <p className='release-date'>
                            {review.release_date}
                        </p>
                    </Box>
                    <p className='section-header'>
                        REVIEW SUMMARY
                    </p>
                    <Divider
                        variant="middle"
                        component="p"
                        sx={{ 
                            bgcolor: 'white',
                            marginTop: '10px',
                            marginBottom: '10px'
                        }}
                    />
                    <InfoDialog
                        open={infoOpen}
                        setOpen={setInfoOpen}
                    />
                    {
                        response.length <= 0 ? 
                        <div className='loading-container'>
                            <div className='loading-bar'>
                                <div
                                    style={{
                                        margin: '20px auto',
                                    }}
                                >
                                    <LoadingBar />
                                </div>
                            </div>
                            <div className='review-container'
                            >
                                <p className='review-summary'>
                                    Summarizing reviews...
                                </p>
                            </div>
                        </div>
                        : 
                        (
                            <>
                                {
                                    response.map((text, index) => {
                                        return (
                                            <p className='summary' key={index}>
                                                {text}
                                            </p>
                                        );
                                    })
                                }
                                <p className='disclaimer'>
                                    Disclaimer: These summaries were generated by AI,
                                    it may not be representative of all the reviews.
                                    Make sure you do your due <u className='link' onClick={() => setInfoOpen(true)}>diligence</u>.
                                </p>
                            </>
                        )
                    }
                    <Button
                        onClick={() => redirectToStore(appId)}
                        sx={{
                            margin: '15px auto 10px auto',
                            ...textStyles.text,
                        }}
                        variant="contained"
                    >
                        Steam Store Info
                    </Button>
                </Box>
            }
        </>
    );
}
