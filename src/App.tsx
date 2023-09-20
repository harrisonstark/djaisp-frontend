import LoginCard from './components/LoginCard'
import Cookies from 'js-cookie';
import RecommendationButton from './components/RecommendationButton'
import React from 'react';


function App() {
  return (
      <div className='dark bg-background text-foreground flex h-screen justify-center items-center'>
          <LoginCard />
          {Cookies.get('loggedIn') === 'true' && <RecommendationButton />}
      </div>
  );
}

export default App;
