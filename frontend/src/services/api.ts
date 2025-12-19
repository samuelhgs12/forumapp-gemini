import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Base URL for our backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
