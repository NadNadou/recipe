import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const login = async (email, password) => {
    
  return await axios.post(`${API_URL}/users/login`, { email, password });
};

export const register = async (data) => {
  return await axios.post(`${API_URL}/users/register`,data);
};
