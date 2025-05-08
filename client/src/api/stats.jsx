// src/api/ingredients.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api/stats',
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
const getWeeklyCalories = () => API.get('/weekly-calories', getAuthHeader());

const getWeeklyIngredientsByDay=()=>API.get("/weekly-ingredients", getAuthHeader())

export default {
    getWeeklyCalories,
    getWeeklyIngredientsByDay
  };