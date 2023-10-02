import LoginCard from './components/LoginCard'
import axios from 'axios'
import Cookies from 'js-cookie';
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
    <div>
      <div className='dark bg-background text-foreground h-screen'>
        <div className="flex flex-col justify-center items-center w-full">
          {token !== '' && <WebPlayer token={token}/>}  
        </div>
        <div className="flex justify-center items-center w-full">
            {Cookies.get('loggedIn') === 'true' ? (
                <SpotifyButton />
          ) : (
              <LoginCard />
          )
          }
        </div>
      </div>
    </div>
  );
}

export default App;
