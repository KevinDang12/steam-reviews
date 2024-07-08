import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import MediaQuery from 'react-responsive';
import HorizontalAdBanner from '../ads/728x90Banner';

export default function SteamReview({ country }) {

    const [ loading, setLoading ] = useState(true);
    const [ review, setReview ] = useState({});
    const [ infoOpen, setInfoOpen ] = useState(false);
    const [ response, setResponse ] = useState([]);
    const [ validId, setValidId ] = useState(true);
    
    const navigate = useNavigate();
    const location = useLocation();

    function redirectToStore(appId) {
        window.open(`https://store.steampowered.com/app/${appId}`);
    }

    useEffect(() => {
        const getResponse = async () => {
            const appId = location.pathname.split('/')[1];
            setLoading(true);
            let steamReview = await axios.get(`${process.env.REACT_APP_URL}/api/gamedetails/${appId}?country=${country}`);
            
            if (steamReview.data === 404) {
                setValidId(false);
                setLoading(false);
                return;
            }
            setReview(steamReview.data);
            setLoading(false);
            const response = await axios.get(`${process.env.REACT_APP_URL}/api/reviews/${appId}?country=${country}`);
            setResponse(response.data);
            setLoading(false);
        }
        getResponse();
    }, [country, location]);

    function getReviews() {
        navigate(`/${review.full_game.appid}`);
    }

    return (
        <div style={{ height: '100vh'}}>
            {
                !validId ? 
                <NotFoundPage /> :
                <div className='review-page'>
                    <div className='review-box'>
                        {
                            loading ?
                            <div className='loading-bar-container'>
                                <div style={{ height: '80vh'}}>
                                    <LoadingBar />
                                </div>
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
                                    margin: '0',
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
                                    onClick={() => navigate(-1)}
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
                                    <MediaQuery minWidth={425}>
                                        <p className='overall-review'>
                                            {review.review_description}
                                        </p>
                                    </MediaQuery>
                                </Box>
                                <MediaQuery minWidth={500}>
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
                                            margin: '0 0 20px 0',
                                        }}
                                    >
                                        <p className='price'>
                                            {review.price}
                                        </p>
                                        <p className='release-date'>
                                            {review.release_date}
                                        </p>
                                    </Box>
                                </MediaQuery>

                                <MediaQuery maxWidth={499}>
                                    <p className='section-header'>
                                        PRICE
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
                                        <p className='mobile-text'>
                                            {review.price}
                                        </p>
                                    </Box>
                                    <p className='section-header'>
                                        RELEASE DATE
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
                                        <p className='mobile-text'>
                                            {review.release_date}
                                        </p>
                                    </Box>
                                </MediaQuery>

                                <p className='section-header'>
                                    CURRENT PLAYER COUNT
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
                                    <p className='player-count'>
                                        {review.player_count} In-Game
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
                                                    margin: '10px auto',
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
                                    onClick={() => redirectToStore(location.pathname.split('/')[1])}
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
                        <MediaQuery minWidth={729}>
                            <div style={{ margin: '20px auto 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <HorizontalAdBanner
                                    optionKey={"89c77bd4e7c2fc1c38fc6b4df4ee667b"}
                                    height={90}
                                    width={728}
                                />
                            </div>
                        </MediaQuery>

                        <MediaQuery maxWidth={728}>
                            <div style={{ margin: '20px auto 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <HorizontalAdBanner
                                    optionKey={"b60371fabf2b5c5d6242d20d7f155218"}
                                    height={250}
                                    width={300}
                                />
                            </div>
                        </MediaQuery>
                    </div>
                </div>
            }
        </div>
    );
}
