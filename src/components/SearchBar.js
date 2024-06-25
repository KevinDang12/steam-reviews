import React, { useState } from 'react';
import axios from 'axios';
import "./SearchBar.css";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function SearchBar({ setResponse, setLoading, setSearchResults, setShowReview, getResponse }) {
  const [ query, setQuery ] = useState("");
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(true);

  // async function getGeoInfo() {
  //   try {
  //     let response = await axios.get('https://ipapi.co/json/')
  //     let country_code = response.data.country_code;
  //     return country_code;
  //   } catch (err) {
  //     console.error(err);
  //   }    
  // };

  async function fetchUserData() {
    try {
      setShowReview(false);
      setResponse([]);
      setLoading(true);
      setQuery("");
      setIsButtonDisabled(true);
      // let country_code = await getGeoInfo();

      if (query.includes("https://store.steampowered.com/app/")) {
        const appId = query.split("/")[4];

        // Check if appId exists on Steam

        getResponse(appId);
        // const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/reviews/${appId}`);
      } else {
        const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/store/${query}`);
        setSearchResults(data);
      }
      // console.log(data);
      // formatResult(data);
      setLoading(false);
    } catch (err) {
      setResponse("Unable to fetch data from the server. Please try again later.");
      console.error(err);
      setLoading(false);
    }
  };

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      if (query) {
        fetchUserData();
      }
    }
  };

  function handleChange(e) {
    setQuery(e.target.value)
    if (e.target.value === "") {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }

  return (
    <div className="input-wrapper">
      <TextField
        className="form-control"
        variant="outlined"
        InputProps={{
          background: 'white',
        }}
        placeholder="Search by game or paste the Steam URL"
        sx={{
          '& .MuiInputBase-input': {
            color: 'white',
            padding: '15px',
            marginLeft: '10px',
            fontFamily: 'Inter, sans-serif',
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'white',
            fontFamily: 'Inter, sans-serif',
          },
          '& .MuiOutlinedInput-root': {
            background: 'transparent',
            borderColor: 'none',
            border: 'none',
            '& fieldset': {
              borderColor: 'none',
              border: 'none',
            },
            '&:hover fieldset': {
              borderColor: 'none',
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'none',
              border: 'none',
            },
          },
        }}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        />
        <IconButton
          onClick={fetchUserData}
          disabled={isButtonDisabled}
          size="small"
          sx={{
            marginRight: '10px',
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: 'lightgray', // Background color on hover
            },
            "&:disabled": {
              backgroundColor: 'grey'
            }
          }}>
          <ArrowUpwardIcon />
        </IconButton>
        {/* <button onClick={fetchUserData}>Send</button> */}
      {/* <TextField className="form-control" variant="filled" label="Search for a Steam Game or paste in the Steam Game URL (https://store.steampowered.com/app/0000/steam_game/)" /> */}
      {/* <FaSearch id="search-icon"/> */}
      {/* <input
          type="text"
          onChange={(e) => setQuery(e.target.value)}
          className="form-control"
          placeholder="Search for Games using the Steam App ID..."
          onKeyDown={handleKeyDown}
      /> */}
      {/* <button onClick={fetchUserData}>Send</button> */}
    </div>
  );
};
