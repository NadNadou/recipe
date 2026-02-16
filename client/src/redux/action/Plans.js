import {
  GET_PLANS_REQUEST,
  GET_PLANS_SUCCESS,
  GET_PLANS_FAIL,
  CREATE_PLAN_REQUEST,
  CREATE_PLAN_SUCCESS,
  CREATE_PLAN_FAIL,
  DELETE_PLAN_SUCCESS,
  UPDATE_PLAN_DATE_SUCCESS,
  UPDATE_PLAN_SUCCESS,
  GET_BATCH_SESSIONS_REQUEST,
  GET_BATCH_SESSIONS_SUCCESS,
  GET_BATCH_SESSIONS_FAIL,
  CREATE_BATCH_SESSION_SUCCESS,
  DELETE_BATCH_SESSION_SUCCESS,
  UPDATE_BATCH_SESSION_SUCCESS,
} from '../constants/Plans';

import api from '../../api/plan';

// ==================== PLANS ====================

// Get all plans
export const getAllPlans = () => async dispatch => {
  try {
    dispatch({ type: GET_PLANS_REQUEST });
    const response = await api.getPlans();
    dispatch({ type: GET_PLANS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_PLANS_FAIL, payload: error.message });
  }
};

// Create a new plan
export const createPlan = (data) => async dispatch => {
  try {
    dispatch({ type: CREATE_PLAN_REQUEST });
    const response = await api.createPlan(data);
    dispatch({ type: CREATE_PLAN_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: CREATE_PLAN_FAIL, payload: error.message });
    throw error;
  }
};

// Delete a plan
export const deletePlan = (id) => async dispatch => {
  try {
    await api.deletePlan(id);
    dispatch({ type: DELETE_PLAN_SUCCESS, payload: id });
  } catch (error) {
    console.error('Error deleting plan', error);
  }
};

// Update plan date
export const updatePlanDate = (id, newDate) => async dispatch => {
  try {
    const res = await api.updatePlan(id, { date: newDate });
    dispatch({ type: UPDATE_PLAN_DATE_SUCCESS, payload: res.data });
  } catch (error) {
    console.error("Error updating plan date:", error);
    throw error;
  }
};

// Update plan
export const updatePlan = (id, data) => async (dispatch) => {
  try {
    const { data: updated } = await api.updatePlan(id, data);
    dispatch({ type: UPDATE_PLAN_SUCCESS, payload: updated });
  } catch (error) {
    console.error("Error updating plan:", error);
  }
};

// ==================== BATCH SESSIONS ====================

// Get batch sessions with remaining portions
export const getBatchSessions = () => async dispatch => {
  try {
    dispatch({ type: GET_BATCH_SESSIONS_REQUEST });
    const response = await api.getBatchSessions();
    dispatch({ type: GET_BATCH_SESSIONS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_BATCH_SESSIONS_FAIL, payload: error.message });
  }
};

// Get all batch sessions
export const getAllBatchSessions = () => async dispatch => {
  try {
    dispatch({ type: GET_BATCH_SESSIONS_REQUEST });
    const response = await api.getAllBatchSessions();
    dispatch({ type: GET_BATCH_SESSIONS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_BATCH_SESSIONS_FAIL, payload: error.message });
  }
};

// Create batch session
export const createBatchSession = (data) => async dispatch => {
  try {
    const response = await api.createBatchSession(data);
    dispatch({ type: CREATE_BATCH_SESSION_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.error('Error creating batch session', error);
    throw error;
  }
};

// Delete batch session
export const deleteBatchSession = (id) => async dispatch => {
  try {
    await api.deleteBatchSession(id);
    dispatch({ type: DELETE_BATCH_SESSION_SUCCESS, payload: id });
  } catch (error) {
    console.error('Error deleting batch session', error);
  }
};

// Update batch session
export const updateBatchSession = (id, data) => async dispatch => {
  try {
    const response = await api.updateBatchSession(id, data);
    dispatch({ type: UPDATE_BATCH_SESSION_SUCCESS, payload: response.data });
  } catch (error) {
    console.error('Error updating batch session', error);
  }
};

// Consume a portion from batch (manual decrease)
export const consumeBatchPortion = (id) => async dispatch => {
  try {
    const response = await api.consumeBatchPortion(id);
    dispatch({ type: UPDATE_BATCH_SESSION_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    console.error('Error consuming batch portion', error);
    throw error;
  }
};
