// Axios instance configured for backend API calls
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL for local development
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
