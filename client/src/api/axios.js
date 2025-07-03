// Axios instance configured for backend API calls
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.DEV
    ? 'http://localhost:4174/api' // local dev
    : '/api', // production on Netlify
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;

