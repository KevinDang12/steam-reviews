import React, { useState } from 'react';
import './App.css';
import SteamUser from './SteamUser';

function App() {

  const [ response, setResponse ] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <div className='search-bar-container'>
        <SteamUser setResponse={setResponse} setLoading={setLoading}/>
        <br />
        { loading ? <div>Loading...</div> : <p>{`${response}`}</p>}
      </div>
    </div>
  );
}

export default App;
