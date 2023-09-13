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
      Cookies.set("code", code, { path: "/" });
    }
    const response = axios.get('http://localhost:8989/healthcheck')
      .then((response) => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error('Error fetching healthcheck:', error);
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
