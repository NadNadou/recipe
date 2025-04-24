// src/api/ingredients.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api/ingredients',
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

// Récupérer tous les ingrédients
const getIngredients = () => API.get('/', getAuthHeader());

// Récupérer un ingrédient spécifique
const getIngredient = (id) => API.get(`/${id}`, getAuthHeader());

// Créer un nouvel ingrédient
const createIngredient = (data) => API.post('/', data, getAuthHeader());

// Mettre à jour un ingrédient
const updateIngredient = (id, data) => API.put(`/${id}`, data, getAuthHeader());

// Supprimer un ingrédient
const deleteIngredient = (id) => API.delete(`/${id}`, getAuthHeader());

export default {
  getIngredients,
  getIngredient,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
