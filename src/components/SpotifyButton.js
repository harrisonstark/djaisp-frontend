import React, { Component } from 'react';
import querystring from 'querystring';
import { generateRandomString } from '../utils/Utils';
import Cookies from 'js-cookie';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:9090/redirect';

class LoginButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: Cookies.get('loggedIn') === 'true',
    };
  }

  handleLoginClick = () => {
    const state = generateRandomString(16);
    Cookies.set("state", state, { path: "/" });
    const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';

    const queryParams = {
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state,
    };

    const loginUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify(queryParams);

    window.location.href = loginUrl;
  };

  handleLogoutClick = () => {
    Cookies.set("loggedIn", 'false', { path: "/" });
    window.location.href = "/";
  }

  render() {
    return (
      <div>
        {this.state.loggedIn ? (
          <button onClick={this.handleLogoutClick}>Logout</button>
        ) : (
          <button onClick={this.handleLoginClick}>Login with Spotify</button>
        )}
      </div>
    );
  }
}

export default LoginButton;