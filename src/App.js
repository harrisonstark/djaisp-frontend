import logo from './logo.svg';
import './App.css';
import SpotifyButton from './components/SpotifyButton'

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
      </header>
    </div>
  );
}

export default App;
