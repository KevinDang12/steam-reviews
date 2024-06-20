// src/components/SteamUser.js

import React, { useState } from 'react';
import axios from 'axios';
import "./SteamUser.css";

export default function SteamUser({ setResponse, setLoading }) {
  const [appId, setAppId] = useState(null);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:5000/api/reviews/${appId}`);
  //       console.log(response.data)
  //       setUserData(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       setError(err);
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, [appId]);

  const fetchUserData = async () => {
    try {
      setResponse("");
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/reviews/${appId}`);
      console.log(response.data)
      setResponse(response.data);
      setLoading(false);
    } catch (err) {
      setResponse("Unable to fetch data from the server. Please try again later.");
      setLoading(false);
    }
  };

  return (
    // <div>
    //   <button onClick={fetchUserData}>Get Review</button>
    //   <p>{userData}</p>
    // </div>
    <div className="input-wrapper">
      {/* <FaSearch id="search-icon"/> */}
      <input
          type="text"
          onChange={(e) => setAppId(e.target.value)}
          className="form-control"
          placeholder="Search for Steam Games using the App ID..."
      />
      <button onClick={fetchUserData}>Send</button>
    </div>
  );
};

// {
//   userData.map(review => (
//       <div>
//           <li>{review.review} {/* | {convertTime(review.timestamp_created)} */}</li>
//           <br />
//       </div>
//   ))
// }
