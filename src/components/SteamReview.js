import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import SteamRating from './SteamRating';
import Divider from '@mui/material/Divider';
import LoadingBar from './LoadingBar';
import he from 'he';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function SteamReview({ appId, result, response, setShowReview }) {

    function redirectToStore(appId) {
        window.open(`https://store.steampowered.com/app/${appId}`);
    }

    const styles = {
        title: {
            margin: '10px 15px 5px 15px',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
        },
        titleRight: {
            margin: '10px 25px 10px auto',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
        }
    }

    /* 
        - Title
        - Image
        - Review Score (#/10) 5 Stars
        - Review Description
        - Price
        - Release Date
        - Description
        - Genres
        - Store Info Link
    */

    return (
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
                    color: 'white'
                }}
                onClick={setShowReview}
                >
                <ArrowBackIcon />
            </IconButton>
            <h1
                style={{
                    margin: '10px',
                    fontWeight: 'normal',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                {result.name}
                {/* Counter-Strike: Global Offensive */}
            </h1>
            <img 
                src={result.image}
                // src='https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/10/header.jpg?t=1666823513'
                alt={result.name}
                style={{
                    margin: '10px',
                    borderRadius: '25px',
                }}
            />
            <p
                style={ styles.title }
            >
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
                    flexWrap: 'wrap'
                }}
            >
                {
                    result.genres.map((genre, index) => {
                        return (
                            <p
                                key={index}
                                style={{
                                    margin: '15px',
                                    color: 'white',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            >
                                {genre}
                            </p>
                        );
                    })
                }
            </Box>
            <p
                style={ styles.title }
            >
                ABOUT THIS GAME
            </p>
            <Divider
                variant="middle"
                component="p"
                sx={{ bgcolor: 'white', marginBottom: '5px' }}
            />
            <p 
                style={{
                    margin: '10px 15px',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                {he.decode(result.description)}
                {/* Play the world's number 1 online action game. Engage in an incredibly realistic brand of terrorist warfare in this wildly popular team-based game. Ally with teammates to complete strategic missions. Take out enemy sites. Rescue hostages. Your role affects your team's success. Your team's success affects your role. */}
            </p>
            <p
                style={ styles.title }
            >
                RECENT REVIEWS
            </p>
            <Divider
                variant="middle"
                component="p"
                sx={{ bgcolor: 'white', marginBottom: '5px' }}
            />
            <Box
                display="flex"
                alignItems="left"
            >
                <SteamRating value={result.review_score} />
                <p 
                    style={{
                        margin: '10px 0',
                        color: 'white',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {result.review_score}/10
                    {/* 9/10 */}
                </p>
                <p
                    style={{
                        margin: '10px 25px 10px auto',
                        color: 'white',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {result.review_description}
                    {/* Overwhelmingly Positive */}
                </p>
            </Box>
            <Box
                display="flex"
                alignItems="left"
            >
                <p
                    style={ styles.title }
                >
                    PRICE
                </p>
                <p
                    style={ styles.titleRight }
                >
                    RELEASE DATE
                </p>
            </Box>
            <Divider
                variant="middle"
                component="p"
                sx={{ bgcolor: 'white', marginBottom: '5px' }}
            />
            <Box
                display="flex"
                alignItems="left"
            >
                <p
                    style={{
                        margin: '10px 15px',
                        color: 'white',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {result.price}
                    {/* $5.99 */}
                </p>
                <p
                    style={{
                        margin: '10px 25px 10px auto',
                        color: 'white',
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {result.release_date}
                    {/* 1 Nov, 2000 */}
                </p>
            </Box>
            <p
                style={ styles.title }
            >
                AI REVIEW SUMMARY
            </p>
            <Divider
                variant="middle"
                component="p"
                sx={{ bgcolor: 'white', marginBottom: '10px' }}
            />
            {
                response.length <= 0 ? <LoadingBar /> : (
                    response.map((text, index) => {
                        return (
                            <p
                                key={index}
                                style={{
                                    margin: '5px 15px',
                                    color: 'white',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            >
                                {text}
                            </p>
                        );
                    })
                )
            }
            {/* {
                response.map((text, index) => {
                    return (
                        <p
                            key={index}
                            style={{
                                margin: '5px 15px',
                                color: 'white',
                            }}
                        >
                            {text}
                        </p>
                    );
                })
            } */}
            {/* <p
                style={{
                    margin: '5px 15px',
                    color: 'white',
                }}
            >
                Counter-Strike 1.6, originally released as a Half-Life mod, continues to be celebrated for its simplicity, competitiveness, and emphasis on teamwork. The game's precise weapon mechanics, iconic maps, and strategic gameplay have kept players engaged for over two decades. Counter-Strike's community-driven evolution through mods and custom content has contributed to its enduring popularity and influence on the first-person shooter genre. However, the original Counter-Strike may feel dated in terms of graphics and user interface compared to its successors. New players might find the learning curve steep, requiring patience and practice to excel in the game.
            </p>
            <p
                style={{
                    margin: '5px 15px',
                    color: 'white',
                }}
            >
                Despite its age, Counter-Strike 1.6 remains a beloved classic among FPS enthusiasts, offering tactical gameplay, skill-based combat, and a vibrant community. The game's active player base, modding support, and competitive scene showcase its lasting impact on the gaming world. While some players may find the graphics outdated and encounter challenges with cheaters, Counter-Strike 1.6's addictive gameplay and strategic depth make it a must-play for fans of competitive shooters seeking a nostalgic yet engaging experience.
            </p> */}
            <Button
                onClick={() => redirectToStore(appId)}
                style={{
                    margin: '10px auto',
                    fontFamily: 'Inter, sans-serif',
                }}
                variant="contained"
            >
                Steam Store Info
            </Button>
            <p
                style={{
                    margin: '5px 15px',
                    color: 'white',
                    fontSize: '10px',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                Disclaimer: These summaries were generated by AI, it may not be representative of all the reviews. Make sure you do your due diligence.
            </p>
        </Box>
    );
}