import axios from 'axios';

const API = axios.create({
  baseURL: '/api/recipes',
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

// Récupérer toutes les recettes (auth requise)
const getRecipes = () => API.get('/', getAuthHeader());

// Récupérer une recette spécifique
const getRecipe = (id) => API.get(`/${id}`, getAuthHeader());

// Créer une nouvelle recette
const createRecipe = (data) => API.post('/', data, getAuthHeader());

// Mettre à jour une recette
const updateRecipe = (id, data) => API.put(`/${id}`, data, getAuthHeader());

// Supprimer une recette
const deleteRecipe = (id) => API.delete(`/${id}`, getAuthHeader());

// Dupliquer une recette
const duplicateRecipe = (id) => API.post(`/${id}/duplicate`,null, getAuthHeader());

// Bulk: update appliances for multiple recipes
const bulkUpdateAppliances = (recipeIds, appliances, mode = 'add') =>
  API.put('/bulk-update-appliances', { recipeIds, appliances, mode }, getAuthHeader());

export default {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  duplicateRecipe,
  deleteRecipe,
  bulkUpdateAppliances,
};
