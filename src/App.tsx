import LoginCard from './components/LoginCard'
import axios from 'axios'
import Cookies from 'js-cookie';
import SpotifyButton from './components/SpotifyButton'
import WebPlayer from './components/WebPlayer'
import React, { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState('');

  async function refreshToken() {
    await axios.put(`https://mmlngy5gds.loclx.io/authorize?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
    getToken();
  }

  async function getToken() {
    const response = await axios.get(`https://mmlngy5gds.loclx.io/get_credentials?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
    setToken(response.data["access_token"]);
  }

  useEffect(() => {
    if (Cookies.get('loggedIn') === 'true') {
      // Initial token retrieval
      refreshToken();

      // Set up interval to refresh token every 55m
      const intervalId = setInterval(refreshToken, 55 * 60 * 1000);

      // Clean up interval when the component is unmounted
      return () => clearInterval(intervalId);
    }
  }, []);
  return (
    <div>
      <div className='dark bg-background text-foreground h-screen'>
        <div className="flex flex-col justify-center items-center w-full">
          {token !== '' && <WebPlayer key={token} token={token} />}
        </div>
        <div className="flex justify-center items-center w-full">
          {Cookies.get('loggedIn') === 'true' ? (
            <SpotifyButton />
          ) : (
            <LoginCard />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;