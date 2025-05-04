import {
    GET_PLANS_REQUEST,
    GET_PLANS_SUCCESS,
    GET_PLANS_FAIL,
    CREATE_PLAN_REQUEST,
    CREATE_PLAN_SUCCESS,
    CREATE_PLAN_FAIL,
    DELETE_PLAN_SUCCESS,
    UPDATE_PLAN_DATE_SUCCESS
  } from '../constants/Plans';
  
  import api from '../../api/plan';
  
  // 📥 Récupérer tous les plans
  export const getAllPlans = () => async dispatch => {
    try {
      dispatch({ type: GET_PLANS_REQUEST });
      const response = await api.getPlans();
      dispatch({ type: GET_PLANS_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: GET_PLANS_FAIL, payload: error.message });
    }
  };
  
  // ➕ Créer un nouveau plan
  export const createPlan = (data) => async dispatch => {
    try {
      dispatch({ type: CREATE_PLAN_REQUEST });
      const response = await api.createPlan(data);
      dispatch({ type: CREATE_PLAN_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: CREATE_PLAN_FAIL, payload: error.message });
    }
  };


  export const deletePlan = (id) => async dispatch => {
    try {
      await api.deletePlan(id); // appel à l'API
      dispatch({ type: DELETE_PLAN_SUCCESS, payload: id });
    } catch (error) {
      console.error('Erreur lors de la suppression du plan', error);
    }
  };

  // redux/action/Plans.js
export const updatePlanDate = (id, newDate) => async dispatch => {
  try {
    const res = await api.updatePlan(id, { date: newDate });
    dispatch({ type: UPDATE_PLAN_DATE_SUCCESS, payload: res.data });
  } catch (error) {
    console.error("❌ Erreur maj date plan :", error);
    throw error;
  }
};

export const updatePlan = (id, data) => async (dispatch) => {
  try {
    const { data: updated } = await api.updatePlan(id, data);
    dispatch({ type: 'UPDATE_PLAN', payload: updated });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du plan :", error);
  }
};

  