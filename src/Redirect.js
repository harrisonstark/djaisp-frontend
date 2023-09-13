import { useEffect } from 'react';
import { getQueryParams } from './utils/Utils';
import axios from 'axios';
import Cookies from 'js-cookie';

function Redirect() {
  useEffect(() => {
    const currentUrl = window.location.href;
    const queryParams = getQueryParams(currentUrl);
    const state = queryParams['state'];
    const code = queryParams['code'];
    if(code && state && Cookies.get('state') === state){
      Cookies.set("loggedIn", 'true', { path: "/" });
    }
    axios.get(`http://localhost:8989/authorize?code=${code}`)
      .then((response) => {
        window.location.href = "/";
        // TODO store user_id and email as cookies, set loggedIn = true, otherwise send to error page?
      })
      .catch((error) => {
        console.error('Error generating tokens:', error);
      });
  }, []);

  const divStyle = {
    backgroundColor: '#16161d',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className="Redirect" style={divStyle} />
  );
}

export default Redirect;
