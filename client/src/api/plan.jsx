// src/api/ingredients.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api/plans',
});

// Fonction pour obtenir le token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Récupérer tous les plan
const getPlans = () => API.get('/', getAuthHeader());

// Récupérer un plan spécifique
const getPlan = (id) => API.get(`/${id}`, getAuthHeader());

// Créer un nouvel plan
const createPlan = (data) => API.post('/', data, getAuthHeader());

// Mettre à jour un plan
const updatePlan = (id, data) => API.put(`/${id}`, data, getAuthHeader());

// Supprimer un plan
const deletePlan = (id) => API.delete(`/${id}`, getAuthHeader());

export default {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
};
