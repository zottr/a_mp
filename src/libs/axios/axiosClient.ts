// src/axiosClient.ts
import axios from 'axios';

// const SERVER_API_URL = 'http://api.zottr.com/server-api';
const SERVER_API_URL = 'https://server-api.zottr.com/';
// const SERVER_API_URL = 'http://172.18.121.156:3002';
// const SERVER_API_URL = 'http://localhost:3002';

const axiosClient = axios.create({
  baseURL: SERVER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
