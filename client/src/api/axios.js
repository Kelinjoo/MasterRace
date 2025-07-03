// Axios instance configured for backend API calls
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  // baseURL: 'http://localhost:4174/api',  Base URL for local development
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
