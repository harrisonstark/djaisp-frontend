import { useEffect } from 'react';
import { getQueryParams, logIn, logOut } from './utils/Utils';
import axios from 'axios';
import Cookies from 'js-cookie';

function Redirect() {
  useEffect(() => {
    const currentUrl = window.location.href;
    const queryParams = getQueryParams(currentUrl);
    const state = queryParams['state'];
    const code = queryParams['code'];
    if(code && state && Cookies.get('state') === state){
        axios.get(`https://zyr4trcva3.loclx.io/authorize?code=${code}`)
        .then((response) => {
            logIn(response.data.user_id, response.data.email);
        })
        .catch((error) => {
            logOut();
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
