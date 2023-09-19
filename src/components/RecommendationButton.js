import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function RecommendationButton() {
  const [displayText, setDisplayText] = useState('Click for Recommendation');

  const handleClick = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const email = Cookies.get('email');
      const response = await axios.get(`http://localhost:8989/get_recommendation?user_id=${user_id}&email=${email}`);
      const data = response.data; // Replace with the actual data you expect from your API
      console.log(data);
      let songs = [];
      for(let track of data['tracks']){
        songs.push(track['name'])
      }
      setDisplayText(songs.toString()); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>{displayText}</button>
    </div>
  );
}

export default RecommendationButton;