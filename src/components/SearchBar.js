import React, { useState } from 'react';
import axios from 'axios';
import "../styles/SearchBar.css";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { textStyles } from '../styles/textStyles';

export default function SearchBar({ country, setResponse, setLoading, setSearchResults, setShowReview, getResponse, setSearched, showToast, status }) {
  const [ query, setQuery ] = useState("");
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(true);

  async function fetchUserData() {
    try {
      setSearched(true);
      setShowReview(false);
      setResponse([]);
      setLoading(true);
      setQuery("");
      setIsButtonDisabled(true);

      if (query.includes("https://store.steampowered.com/app/") && query.split("/")[4]) {
        const appId = query.split("/")[4];
        getResponse(appId);
      } else if (!query.includes("http")) {
        const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/store/${query}?country=${country}`);
        
        if (data.length !== "404") {
          setSearchResults(data);
        }
      } else {
        showToast(5000, "Invalid Steam URL.");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showToast(3000, "Unable to search for Steam game. Please try again later.");
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
        disabled={!status}
        className="form-control"
        variant="outlined"
        InputProps={{
          background: 'white',
        }}
        placeholder={status ? "Search by game or paste the Steam URL" : ""}
        sx={{
          '& .MuiInputBase-input': {
            padding: '15px',
            marginLeft: '10px',
            ...textStyles.text,
          },
          '& .MuiInputBase-input::placeholder': {
            ...textStyles.text,
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
              backgroundColor: 'lightgray',
            },
            "&:disabled": {
              backgroundColor: 'grey'
            }
          }}>
          <ArrowUpwardIcon />
        </IconButton>
    </div>
  );
};
