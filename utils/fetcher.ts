import axios from 'axios';

export const BASE_URL = 'http://localhost:3095';

axios.defaults.baseURL = BASE_URL;

export const getUserFetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((response) => response.data);
