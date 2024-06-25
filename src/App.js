import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SteamResult from './components/SteamResult';
import LoadingBar from './components/LoadingBar';
import SteamReview from './components/SteamReview';
import axios from 'axios';
import CountrySelect from './components/CountrySelect';

function App() {

  const [ showReview, setShowReview ] = useState(false);
  const [ appId, setAppId ] = useState("");
  const [ steamReview, setSteamReview ] = useState({});
  const [ response, setResponse ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ loadReviews, setLoadReviews ] = useState(false);
  const [ searchResults, setSearchResults ] = useState([]);

  function formatResult(text) {
    let paragraphs = text.split('\n');
      for (let i = 0; i < paragraphs.length; i++) {
        paragraphs[i].replace(/(\r\n|\n|\r)/gm, "");
      }
      setResponse(paragraphs);
  }

  async function getResponse(appId) {
    setLoadReviews(true);
    let steamReview = await axios.get(`${process.env.REACT_APP_URL}/api/gamedetails/${appId}`);
    setSteamReview(steamReview.data);
    setShowReview(true);
    setLoadReviews(false);
    // const response = await axios.get(`${process.env.REACT_APP_URL}/api/reviews/${appId}`);
    setAppId(appId);
    // formatResult(response.data);
    // console.log(response.data);
  }

  return (
    <div className="App">   
      {
        loadReviews ?

        <div className='loading-bar-container'>
          <LoadingBar />
        </div> :
        
        <div className='search-bar-container'>
          {
            showReview ? <SteamReview 
              appId={appId}
              result={steamReview}
              response={response}
              setShowReview={() => setShowReview(false)}
            /> : (
            <>
              <div
                style={{ display: 'flex', alignItems: 'center' }}>
                  <SearchBar
                    setResponse={setResponse}
                    setLoading={setLoading}
                    setSearchResults={setSearchResults}
                    setShowReview={setShowReview}
                    getResponse={getResponse}
                  />
                  <div style={{
                    position: 'absolute', right: '20px', top: '20px', marginRight: '25px'
                  }}>
                    <CountrySelect />
                  </div>
              </div>
              {
                loading ? 
      
                <div className='loading-bar-container'>
                  <LoadingBar />
                </div> :
      
                <div className='results-container'>
                  {
                    searchResults.map((result) => {
                      return (
                        <SteamResult
                          getResponse={() => getResponse(result.id)}
                          key={result.id}
                          image={result.image}
                          name={result.name}
                          price={result.price}
                          currency={result.currency}
                        />
                      )
                    })
                  }
                </div>
              }
            </>
          )}
        </div>
      }
      
    </div>
  );
}

export default App;

/* {
  showReview ? <SteamReview 
    appId={appId}
    result={steamReview}
    response={response}
  /> : (
    loading ? 

    <div className='loading-bar-container'>
      <LoadingBar />
    </div> :

    <div className='results-container'>
      {
        searchResults.map((result) => {
          return (
            <SteamResult
              getResponse={() => getResponse(result.id)}
              key={result.id}
              image={result.image}
              name={result.name}
              price={result.price}
              currency={result.currency}
            />
          )
        })
      }
    </div>
  )
} */