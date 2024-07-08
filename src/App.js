import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.js';
import SteamReview from './components/SteamReview.js';
import NotFoundPage from './components/NotFoundPage.js';

function App() {
  const [ country, setCountry ] = useState("us");

  return (
    <Router>
      <div style={{ backgroundColor: '#212121' }}>
        <Routes>
          <Route
            exact path={"/"}
            element={
              <Home
                country={country}
                setCountry={setCountry}
              />
            }
          />
          <Route path={`/:id`} element={
                  <div>
                    <SteamReview country={country}/>
                  </div>
                }
          />
          <Route path={`/?term=:name`}
            element={
              <Home
                country={country}
                setCountry={setCountry} />
            }
          />
          <Route path={'*'} element={<NotFoundPage />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
