import React from 'react';
import querystring from 'querystring';
import { generateRandomString, logOut } from '../utils/Utils';
import {Button} from './ui/button'
import Cookies from 'js-cookie';
import {BsSpotify} from 'react-icons/bs'

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:9090/redirect';

class LoginButton extends React.Component<{selectedTheme: string}, {loggedIn: boolean}> {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: Cookies.get('loggedIn') === 'true',
    };
  }

  handleLoginClick = () => {
    const state = generateRandomString(16);
    Cookies.set("state", state, { path: "/" });
    const scope = 'streaming user-read-private user-read-email';

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
    logOut();
  }

  render() {
    return (
      <div>
        {this.state.loggedIn ? (
          <Button onClick={this.handleLogoutClick}
            className={` font-bold w-full  border-2
                        ${this.props.selectedTheme === 'dark' ? "bg-foreground text-background border-background" :
                        "border-[#22311d] bg-[#79AC78] text-[#22311d]"}`}>Log out
          </Button>
        ) : (
          <Button onClick={this.handleLoginClick} 
            className='flex justify-center items-center font-bold w-full'>
            <BsSpotify size={22} className='mr-3'/>
            <p>Login with Spotify</p>
          </Button>
        )}
      </div>
    );
  }
}

export default LoginButton;