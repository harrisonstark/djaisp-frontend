import axios from 'axios'

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