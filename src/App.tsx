import LoginCard from './components/LoginCard'
import axios from 'axios'
import Cookies from 'js-cookie';
import SpotifyButton from './components/SpotifyButton'
import WebPlayer from './components/WebPlayer'
import { Chat } from './components/chat/chat'
import React, { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState('');

  async function refreshToken() {
    await axios.put(`http://localhost:8989/authorize?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
    getToken();
  }

  async function getToken() {
    const response = await axios.get(`http://localhost:8989/get_credentials?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
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
    <div className="dark bg-background text-foreground h-screen overflow-y-scroll">
      <div className='dark bg-background text-foreground'>
        <div className="flex flex-col justify-center items-center w-full">
          {token !== '' && 
          (
          <div className='w-full h-full'>
            <WebPlayer key={token} token={token} />
            <Chat />
          </div>)
          }
        </div>
        <div className="flex justify-center items-center w-full">
          {Cookies.get('loggedIn') === 'true' ? (
            <div />
          ) : (
            <LoginCard />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;