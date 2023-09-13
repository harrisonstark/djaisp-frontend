import { useEffect } from 'react';
import { getQueryParams } from './utils/Utils';
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
    window.location.href = "/";
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
