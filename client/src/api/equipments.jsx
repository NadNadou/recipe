import axios from 'axios';

const API = axios.create({
  baseURL: '/api/equipments',
});

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getEquipments = () => API.get('/', getAuthHeader());
const getEquipment = (id) => API.get(`/${id}`, getAuthHeader());
const createEquipment = (data) => API.post('/', data, getAuthHeader());
const updateEquipment = (id, data) => API.put(`/${id}`, data, getAuthHeader());
const deleteEquipment = (id) => API.delete(`/${id}`, getAuthHeader());

export default {
  getEquipments,
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
