import axios from 'axios';

export const getUserFetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((response) => response.data);
