import Cookies from 'js-cookie';

export function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter++;
  }
  return result;
}

export function getQueryParams(url) {
  const queryParams = {};
  const queryString = url.split('?')[1]; // Get the query string part of the URL

  if (queryString) {
    const paramPairs = queryString.split('&');
    for (const pair of paramPairs) {
      const [key, value] = pair.split('=');
      queryParams[key] = decodeURIComponent(value); // Decode URI-encoded values
    }
  }

  return queryParams;
}

export function removeDuplicates(arr) {
  return Array.from(new Set(arr));
}

export function logIn(user_id, email) {
  Cookies.set("loggedIn", 'true', { path: "/" });
  Cookies.set("user_id", user_id, { path: "/" });
  Cookies.set("email", email, { path: "/" });
  window.location.href = "/";
}

export function logOut() {
  Cookies.set("loggedIn", 'false', { path: "/" });
  Cookies.set("email", '', { path: "/" });
  Cookies.set("user_id", '', { path: "/" });
  window.location.href = "/";
}