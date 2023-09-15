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
        axios.get(`http://localhost:8989/authorize?code=${code}`)
        .then((response) => {
            Cookies.set("loggedIn", 'true', { path: "/" });
            Cookies.set("user_id", response.data.user_id, { path: "/" });
            Cookies.set("email", response.data.email, { path: "/" });
            window.location.href = "/";
        })
        .catch((error) => {
            console.error('TODO send user to error page and ask to try again', error);
        });
    }
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
