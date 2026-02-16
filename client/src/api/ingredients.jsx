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

// Enrichir un ingrédient avec OpenFoodFacts
const enrichIngredient = (id, searchTerm = null) =>
  API.post(`/${id}/enrich`, searchTerm ? { searchTerm } : {}, getAuthHeader());

// Enrichir tous les ingrédients
const enrichAllIngredients = (overwrite = false) =>
  API.post('/enrich-all', { overwrite }, getAuthHeader());

// Rechercher les données nutritionnelles (preview sans sauvegarder)
const searchNutrition = (searchTerm) =>
  API.post('/search-nutrition', { searchTerm }, getAuthHeader());

// Rechercher plusieurs résultats nutritionnels (sélection UI)
const searchNutritionMultiple = (searchTerm) =>
  API.post('/search-nutrition-multiple', { searchTerm }, getAuthHeader());

export default {
  getIngredients,
  getIngredient,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  enrichIngredient,
  enrichAllIngredients,
  searchNutrition,
  searchNutritionMultiple,
};
