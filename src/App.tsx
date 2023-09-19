import SpotifyButton from './components/SpotifyButton'
import Cookies from 'js-cookie';
import RecommendationButton from './components/RecommendationButton'
import React from 'react';


function App() {
  return (
      <div>
          <div className="text-3xl text-bold">
            AI DJ App (UI Test)
          </div>
          <p>There should be a green Login to Spotify Button below.</p>
          <p>Please check that the login functionality still works - Zack</p>
          <SpotifyButton />
          {Cookies.get('loggedIn') === 'true' && <RecommendationButton />}
      </div>
  );
}

export default App;
