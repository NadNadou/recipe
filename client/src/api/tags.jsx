import axios from 'axios';

const API = axios.create({
  baseURL: '/api/tags',
});

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getTags = () => API.get('/', getAuthHeader());
const getTag = (id) => API.get(`/${id}`, getAuthHeader());
const createTag = (data) => API.post('/', data, getAuthHeader());
const updateTag = (id, data) => API.put(`/${id}`, data, getAuthHeader());
const deleteTag = (id) => API.delete(`/${id}`, getAuthHeader());

export default {
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
};
