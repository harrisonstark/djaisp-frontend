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
      const response = await axios.get(`http://localhost:8989/get_credentials?user_id=srl2snyev9no2wualyyt3goj7&email=hstark@ufl.edu`);
      setToken(response.data["access_token"]);
    }
    if(Cookies.get('loggedIn') === 'true'){
      getToken();
    }

  }, []);

  return (
      <div className='dark bg-background text-foreground flex h-screen justify-center items-center'>
        <div className="flex flex-col items-center w-full h-screen">
          {token !== '' && <WebPlayer token={token}/>}
          {Cookies.get('loggedIn') === 'true' ? (
            <SpotifyButton />
          ) : (
              <LoginCard />
          )
          }
        </div>
      </div>
  );
}

export default App;
