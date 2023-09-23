import LoginCard from './components/LoginCard'
import axios from 'axios'
import Cookies from 'js-cookie';
import RecommendationButton from './components/RecommendationButton'
import SpotifyButton from './components/SpotifyButton'
import WebPlayer from './components/WebPlayer'
import React, { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {

    async function getToken() {
      const response = await axios.get(`http://localhost:8989/get_credentials?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
      setToken(response.data["access_token"]);
    }
    if(Cookies.get('loggedIn') === 'true'){
      getToken();
    }

  }, []);

  return (
      <div className='dark bg-background text-foreground flex h-screen justify-center items-center'>
        <div className="button-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
          {token !== '' && <WebPlayer token={token}/>}
          {Cookies.get('loggedIn') === 'true' ? (
          <>
            <SpotifyButton />
            <RecommendationButton />
          </>
          ) : (
            <LoginCard />
          )
          }
        </div>
      </div>
  );
}

export default App;
