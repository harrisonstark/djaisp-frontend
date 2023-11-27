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

export function logIn(user_id, email) {
  Cookies.set("loggedIn", 'true', { path: "/" });
  Cookies.set("user_id", user_id, { path: "/" });
  Cookies.set("email", email, { path: "/" });
  window.location.href = "/";
}

export function logOut() {
  Cookies.remove("loggedIn");
  Cookies.remove("user_id");
  Cookies.remove("email");
  Cookies.remove("volume");
  Cookies.remove("trackList");
  Cookies.remove("counter");
  Cookies.remove("seedGenres");
  Cookies.remove("seedNumber");
  Cookies.remove("seedSize");
  Cookies.remove("userRecentMessage");
  Cookies.remove("maistroRecentMessage");
  Cookies.remove("profilePicture");
  Cookies.remove("layout");
  Cookies.remove("theme");
  window.location.href = "/";
}