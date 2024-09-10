import React from 'react';
import MediaQuery from 'react-responsive';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import SearchBar from './SearchBar';
import NavDrawer from './NavDrawer';
import icon from '../resource/icon.png';
import '../styles/NavBar.css';

export default function Navbar({ status, country, setInfoOpen, handleCountryDialog }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <MediaQuery maxWidth={1023}>
          <div className='menu-icons-mobile'>
            <NavDrawer
              className="mobile-button"
              country={country}
              setInfoOpen={setInfoOpen}
              handleCountryDialog={handleCountryDialog}
            />
          </div>
        </MediaQuery>
      </div>
      
      <div style={{ flex: 3, display: 'flex', justifyContent: 'center' }}>
        <MediaQuery minWidth={768}>
          <div
            className='icon'
          >
            <img
              title="Logo"
              width="40"
              height="40"
              srcSet={icon}
              src={icon}
              alt=""
            />
          </div>
        </MediaQuery>
        <SearchBar status={status} />
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <MediaQuery minWidth={1024}>
          <div className='menu-icons' style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              onClick={handleCountryDialog}
              sx={{
                margin: '10px 5px 0 5px',
                color: 'white',
                height: '50px',
                width: '50px',
                '&:hover': {
                  backgroundColor: 'lightgray',
                },
              }}
            >
              <img
                title="Country Flag"
                width="30"
                height="15"
                srcSet={`https://flagcdn.com/w40/${country}.png 2x`}
                src={`https://flagcdn.com/w20/${country}.png`}
                alt=""
              />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setInfoOpen(true)}
              sx={{
                margin: '10px 5px 0 5px',
                color: 'white',
                height: '50px',
                width: '50px',
                '&:hover': {
                  backgroundColor: 'darkgray',
                },
              }}
            >
              <InfoIcon
                fontSize="small"
                sx={{
                  height: '30px',
                  width: '30px',
                }}
              />
            </IconButton>
          </div>
        </MediaQuery>
      </div>
    </div>
  );
}
