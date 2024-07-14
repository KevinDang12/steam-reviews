import React, { useState, useEffect, useRef } from 'react';
import '../styles/Home.css';
import SteamResult from './SteamResult';
import axios from 'axios';
import CountrySelect from './CountrySelectDialog';
import Snackbar from '@mui/material/Snackbar';
import InfoDialog from './InfoDialog';
import LoadingBar from './LoadingBar';
import MediaQuery from 'react-responsive';
import { useLocation } from 'react-router-dom';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import HorizontalAdBanner from '../ads/HorizontalAdBanner';
import Navbar from './NavBar';
import LeftAdBanner from '../ads/LeftAdBanner';
import RightAdBanner from '../ads/RightAdBanner';
import debounce from 'lodash/debounce';

export default function Home(props) {

  const { country, setCountry } = props;

  const [ loading, setLoading ] = useState(false);
  const [ searchResults, setSearchResults ] = useState([]);
  const [ countryDialogOpen, setCountryDialogOpen ] = useState(false);
  const [ infoOpen, setInfoOpen ] = useState(false);

  const [ toastOpen, setToastOpen ] = useState(false);
  const [ toastMessage, setToastMessage ] = useState("");
  const [ toastDuration, setToastDuration ] = useState(0);

  const [ countries, setCountries ] = useState([]);
  const [ status, setStatus ] = useState(true);
  const [ showError, setShowError ] = useState(false);
  const [ showIcon, setShowIcon ] = useState(false);

  const [ errorMessage, setErrorMessage ] = useState("");
  const [ className, setClassName ] = useState("search-bar-container");

  const location = useLocation();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    async function getCountries() {
      try {
        let { data } = await axios.get(`${process.env.REACT_APP_URL}/api/countries`);
        setCountries(data);
      } catch (err) {
        setCountries([]);
        console.error(err);
      }
    }
    getCountries();
  }, []);

  useEffect(() => {
    async function serverStatus() {
      try {
        let { data } = await axios.get(`${process.env.REACT_APP_URL}/api/status`);
        if (data !== "The server is running") {
          setShowError(true);
          setErrorMessage("Unable to search for Steam games. Please try again later.");
          setStatus(false);
        } else {
          setStatus(true);
        }
      } catch (err) {
        setShowError(true);
        setStatus(false);
        setErrorMessage("Unable to search for Steam games. Please try again later.");
      }
    }
    setShowError(false);
    serverStatus();
  }, []);

  useEffect(() => {
    async function searchQuery (query) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setSearchResults([]);
        const { data } = await axios.get(
          `${process.env.REACT_APP_URL}/api/store/${query}?country=${country}`,
          { signal: abortControllerRef.current.signal }
        );
        if (data.length <= 0) {
          setErrorMessage("0 results match your search.");
          setShowError(true);
        } else {
          setSearchResults(data);
          setShowError(false);
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          setShowError(true);
          setErrorMessage("0 results match your search.");
        }
      } finally {
        setLoading(false);
      }
    };

    const debouncedSearchQuery = debounce(searchQuery, 50);

    if (status) {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get('term');
      if (query !== null && query !== '') {
        debouncedSearchQuery(query);
        setShowIcon(false);
      } else {
        setShowIcon(true);
        setSearchResults([]);
        setShowError(false);
      }
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      debouncedSearchQuery.cancel();
    };
  }, [location.search, status, country]);

  function handleCountryDialog() {
    if (countries.length > 0) {
      setCountryDialogOpen(true);
    } else {
      showToast(3000, "Unable to select country. Please try again later.");
    }
  }

  const showToast = (duration, message) => {
    setToastOpen(true);
    setToastDuration(duration);
    setToastMessage(message);
  };

  function handleClose() {
    setToastOpen(false);
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setClassName("search-bar-container");
      } else {
        setClassName("search-bar-container-mobile");
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="App">
      <Navbar
        status={status}
        country={country}
        setInfoOpen={setInfoOpen}
        handleCountryDialog={handleCountryDialog}
      />
      {
        <div className='container'>
            <div className="left-component">
              <MediaQuery minWidth={1024}>
                <LeftAdBanner />
              </MediaQuery>
            </div>
          <div className={className}>
            {(
              <>
                {
                  loading ? 
          
                  <div className='loading-bar-container'>
                    <div style={{ height: '80vh' }}>
                      <LoadingBar />
                    </div>
                  </div> :

                  <div className='results-container'>
                    {
                      (searchResults.length === 0) ?
                      <>
                        {
                          showError ?
                          <h1 className='error-message'>{errorMessage}</h1> : 
                          (
                            showIcon &&
                            <div style={{alignItems: 'center', margin: 'auto 0'}}>
                              <SportsEsportsIcon
                                sx={{
                                  color: 'white',
                                  fontSize: 300,
                                  transition: 'font-size 0.4s',
                                  backgroundColor: '#212121',
                                  '&:hover': {
                                    fontSize: 350,
                                    transition: 'font-size 0.4s'
                                  }
                                }}
                              />
                              <p className='welcome-message'>A Steam game review summarizer that fetches game reviews from Steam, which are then passed to OpenAI to process and generate a summary of the reviews. To get started, search for your game!</p>
                              <MediaQuery maxWidth={1023}>
                                <HorizontalAdBanner
                                  optionKey={"b60371fabf2b5c5d6242d20d7f155218"}
                                  height={250}
                                  width={300}
                                />
                              </MediaQuery>
                            </div>
                          )
                        }
                      </> :
                      <>
                      {searchResults.map((result) => {
                        return (
                          <SteamResult
                            key={result.id}
                            appId={result.id}
                            image={result.image}
                            name={result.name}
                            price={result.price}
                            currency={result.currency}
                          />
                        )
                      })}
                      <MediaQuery maxWidth={1023}>
                        <HorizontalAdBanner
                          optionKey={"b60371fabf2b5c5d6242d20d7f155218"}
                          height={250}
                          width={300}
                        />
                      </MediaQuery>
                      </>
                    }
                  </div>
                }
              </>
            )}
          </div>
          <div className="right-component">    
            <MediaQuery minWidth={1024}>
              <RightAdBanner />
            </MediaQuery>
          </div>
        </div>
      }

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={toastDuration}
        open={toastOpen}
        onClose={handleClose}
        message={toastMessage}
      />

      <CountrySelect
        country={country} 
        setCountry={setCountry} 
        setOpen={setCountryDialogOpen} 
        open={countryDialogOpen}
        countries={countries}
      />

      <InfoDialog
        open={infoOpen}
        setOpen={setInfoOpen}
      />
    </div>
  );
}
