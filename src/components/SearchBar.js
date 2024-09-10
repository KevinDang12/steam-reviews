import React, { useEffect, useState } from 'react';
import "../styles/SearchBar.css";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { textStyles } from '../styles/textStyles';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { analytics, logEvent } from '../firebase/analytics';

export default function SearchBar({ status }) {
  const [ query, setQuery ] = useState("");
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setQuery("");
  }, [location.search]);

  function logSearchEvent(eventParams) {
    logEvent(analytics, 'firebase_user_search_result', eventParams);
  }

  async function sendAnalytics(eventParams) {
    await axios.post(`${process.env.REACT_APP_URL}/db/analytics`, eventParams);
  }

  async function eventLogging(query) {
    if (window.gtag) {
      const userAgent = navigator.userAgent;
      let date = new Date();
      date = Math.floor(date.getTime() / 1000);

      try {
        window.gtag('event', `user_search_result_count`, {
          'search_query': `Query for: ${query}`,
        });
        const response = await axios.get('https://geolocation-db.com/json/');
        const data = response.data;
        
        window.gtag('get', 'G-YDB7239WQW', 'client_id', async (clientId) => {
          const eventParams = {
            'search_query': `Query for: ${query}`,
            'date': date,
            'ip': data.IPv4,
            'city': data.city,
            'country': data.country_name,
            'state': data.state,
            'user_agent': userAgent,
            'country_code': data.country_code,
            'latitude': data.latitude,
            'longitude': data.longitude,
            'postal': data.postal,
            'client_web_id': clientId.toString(),
          };
          window.gtag('event', `user_search_result`, eventParams);
          logSearchEvent(eventParams);
          await sendAnalytics(eventParams);
        });

      } catch (error) {
        console.error('Error fetching geolocation data:', error);
        window.gtag('get', 'G-YDB7239WQW', 'client_id', async (clientId) => {
          let response;
          try {
              response = await axios.get('https://checkip.amazonaws.com/');
              response = response.data.replace(/(\r\n|\n|\r)/gm, "");
          } catch (error) {
              response = null;
          }

          const eventParams = {
            'search_query': `Query for: ${query}`,
            'date': date,
            'ip': response,
            'user_agent': userAgent,
            'client_web_id': clientId.toString(),
          };
          
          window.gtag('event', `user_search_result`, eventParams);
          logSearchEvent(eventParams);
          await sendAnalytics(eventParams);
        });
      }
    }
  }

  async function fetchGameData(query) {
      if (query.includes("https://store.steampowered.com/app/") && query.split("/")[4]) {
        const appId = query.split("/")[4];
        navigate(`/${appId}`);
      } else {
        navigate(`/?term=${query}`);
      }

      eventLogging(query);

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
