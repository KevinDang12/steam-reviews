import React, { useEffect, useState } from 'react';
import "../styles/SearchBar.css";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { textStyles } from '../styles/textStyles';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SearchBar({ status }) {
  const [ query, setQuery ] = useState("");
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setQuery("");
  }, [location.search]);

  async function fetchGameData(query) {
      if (query.includes("https://store.steampowered.com/app/") && query.split("/")[4]) {
        const appId = query.split("/")[4];
        navigate(`/${appId}`);
      } else {
        navigate(`/?term=${query}`);
      }

      setQuery("");
      setIsButtonDisabled(true);
  };

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      if (query) {
        fetchGameData(query);
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
      <div className='search-box'>
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
            onClick={() => fetchGameData(query)}
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
    </div>
  );
};
