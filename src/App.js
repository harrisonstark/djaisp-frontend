import { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginButton from './components/LoginButton'
import { getQueryParams } from './utils/Utils';
import Cookies from 'js-cookie';

function App() {
  useEffect(() => {
    const currentUrl = window.location.href;
    const queryParams = getQueryParams(currentUrl);
    const state = queryParams['state'];
    const code = queryParams['code'];
    if(code && state && Cookies.get('state') === state){
      Cookies.set("loggedIn", 'true', { path: "/" });
      window.location.href = "/";
    }
  }, []);

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
          Learn React
        </a>
        <LoginButton />
      </header>
    </div>
  );
}

export default App;
