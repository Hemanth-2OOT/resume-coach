import axios from 'axios';
import { API_PREFIX } from '../config';

const api = axios.create({ baseURL: API_PREFIX, withCredentials: true });

export function setAuthToken(token){
  if(token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export default api;
