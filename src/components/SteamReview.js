import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useEffect, useState, useRef } from 'react';
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
import HorizontalAdBanner from '../ads/HorizontalAdBanner';
import LeftAdBanner from '../ads/LeftAdBanner';
import RightAdBanner from '../ads/RightAdBanner';

export default function SteamReview({ country }) {

    const [ loading, setLoading ] = useState(true);
    const [ review, setReview ] = useState({});
    const [ infoOpen, setInfoOpen ] = useState(false);
    const [ response, setResponse ] = useState([]);
    const [ validId, setValidId ] = useState(true);
    const hasRun = useRef(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const appId = location.pathname.split('/')[1];

    function redirectToStore(appId) {
        window.open(`https://store.steampowered.com/app/${appId}`);
    }

    useEffect(() => {
        if (hasRun.current) {
          return;
        }
        hasRun.current = true;
    
        async function getResponse() {
          setLoading(true);
          try {
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
    
            if (window.gtag) {
              window.gtag('event', 'steam_review', {
                'app_name': 'Steam Review Summarizer',
                'steam_game': `Review for ${steamReview.data.name}`,
              });
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
          }
        }
        getResponse();
      }, [country, appId]);

    function getReviews() {
        navigate(`/${review.full_game.appid}`);
    }

    return (
        <div style={{ height: '100vh'}}>
            {
                !validId ? 
                <NotFoundPage /> :
                <div className='review-page'>
                    <div className="left-component">
                        <MediaQuery minWidth={1024}>
                            <LeftAdBanner />
                        </MediaQuery>
                    </div>
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
                                    <MediaQuery minWidth={550}>
                                        <p className='overall-review'>
                                            {review.review_description}
                                        </p>
                                    </MediaQuery>
                                </Box>
                                <MediaQuery minWidth={768}>
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

                                <MediaQuery maxWidth={767}>
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
                                        {review.player_count > 0 ? `${review.player_count} In-Game` : 'Not available'}
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
                            <div style={{ margin: '20px auto 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <MediaQuery maxWidth={1023}>
                                    <HorizontalAdBanner
                                        optionKey={"b60371fabf2b5c5d6242d20d7f155218"}
                                        height={250}
                                        width={300}
                                    />
                                </MediaQuery>
                            </div>
                    </div>
                    <div className="right-component">
                        <MediaQuery minWidth={1024}>
                            <RightAdBanner />
                        </MediaQuery>
                    </div>
                </div>
            }
        </div>
    );
}
