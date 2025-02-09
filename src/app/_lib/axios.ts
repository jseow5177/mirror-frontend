'use server';

import axios from 'axios';
import { cookies } from 'next/headers';

const baseUrl = process.env.BACKEND_URL || 'http://localhost:8080/api/v1'

export const getBaseUrl = () => {
  return baseUrl
}

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  withCredentials: true, // TODO: NOT WORKING?
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const cookieStore = cookies();
    config.headers['Cookie'] = `session=${cookieStore.get('session')?.value};`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
