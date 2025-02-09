'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:9090/api/v1',
  timeout: 30000,
  withCredentials: true, // TODO: NOT WORKING?
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    config.headers['Cookie'] = `session=${cookieStore.get('session')?.value};`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
