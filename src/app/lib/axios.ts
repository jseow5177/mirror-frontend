import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090/api/v1',
  timeout: 5000,
});

export default axiosInstance;
