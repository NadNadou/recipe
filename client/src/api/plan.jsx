// src/api/plan.jsx
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

// ==================== PLANS ====================

// Récupérer tous les plans
const getPlans = () => API.get('/', getAuthHeader());

// Récupérer un plan spécifique
const getPlan = (id) => API.get(`/${id}`, getAuthHeader());

// Créer un nouvel plan
const createPlan = (data) => API.post('/', data, getAuthHeader());

// Mettre à jour un plan
const updatePlan = (id, data) => API.put(`/${id}`, data, getAuthHeader());

// Supprimer un plan
const deletePlan = (id) => API.delete(`/${id}`, getAuthHeader());

// ==================== BATCH SESSIONS ====================

// Récupérer les sessions batch avec portions restantes
const getBatchSessions = () => API.get('/batch', getAuthHeader());

// Récupérer toutes les sessions batch
const getAllBatchSessions = () => API.get('/batch/all', getAuthHeader());

// Créer une session batch
const createBatchSession = (data) => API.post('/batch', data, getAuthHeader());

// Mettre à jour une session batch
const updateBatchSession = (id, data) => API.put(`/batch/${id}`, data, getAuthHeader());

// Supprimer une session batch
const deleteBatchSession = (id) => API.delete(`/batch/${id}`, getAuthHeader());

// Consommer une portion manuellement (sans planifier)
const consumeBatchPortion = (id) => API.post(`/batch/${id}/consume`, {}, getAuthHeader());

export default {
  // Plans
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  // Batch Sessions
  getBatchSessions,
  getAllBatchSessions,
  createBatchSession,
  updateBatchSession,
  deleteBatchSession,
  consumeBatchPortion,
};
