// src/axiosClient.ts
import axios from 'axios';

// const SERVER_API_URL = 'http://api.zottr.com/server-api';
const SERVER_API_URL = 'https://api.zottr.com/server-api';
// const SERVER_API_URL = 'http://localhost:3002';

const axiosClient = axios.create({
  baseURL: SERVER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
