import logo from './logo.svg';
import './App.css';
import SpotifyButton from './components/SpotifyButton'
import Cookies from 'js-cookie';
import RecommendationButton from './components/RecommendationButton'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Main page.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          TODO setup frontend with listening and chat input
        </a>
        <SpotifyButton />
        {Cookies.get('loggedIn') === 'true' && <RecommendationButton />}
      </header>
    </div>
  );
}

export default App;
