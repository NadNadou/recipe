import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'; // adapte si besoin

export const login = async (email, password) => {
    
  return await axios.post(`${API_URL}/users/login`, { email, password });
};

export const register = async (name, email, password) => {
  return await axios.post(`${API_URL}/users/register`, { name, email, password });
};
