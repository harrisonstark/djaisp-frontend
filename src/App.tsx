import LoginCard from './components/LoginCard'
import axios from 'axios'
import Cookies from 'js-cookie';
import WebPlayer from './components/WebPlayer'
import { Chat } from './components/chat/chat'
import SettingsButton from './components/SettingsButton'
import React, { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState('');

  async function refreshToken() {
    await axios.put(`https://zyr4trcva3.loclx.io/authorize?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
    getToken();
  }

  async function getToken() {
    const response = await axios.get(`https://zyr4trcva3.loclx.io/get_credentials?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
    setToken(response.data["access_token"]);
    getProfilePictureURL();
  }

  async function getProfilePictureURL() {
    const response = await axios.get(`https://zyr4trcva3.loclx.io/get_user_information?user_id=${Cookies.get('user_id')}&email=${Cookies.get('email')}`);
    Cookies.set("profilePicture", response.data["url"], "/");
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
              <div className="min-[100px]:hidden md:flex mr-8 mb-8 absolute bottom-0 right-0 h-16 w-16">
                  <SettingsButton />
              </div>
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