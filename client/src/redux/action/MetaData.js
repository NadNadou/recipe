import apiIngredients from '../../api/ingredients';
import apiTags from '../../api/tags';
import apiEquipments from '../../api/equipments';

import {
  GET_INGREDIENTS_REQUEST, GET_INGREDIENTS_SUCCESS, GET_INGREDIENTS_FAIL,
  CREATE_INGREDIENT_REQUEST, CREATE_INGREDIENT_SUCCESS, CREATE_INGREDIENT_FAIL,
  UPDATE_INGREDIENT_REQUEST, UPDATE_INGREDIENT_SUCCESS, UPDATE_INGREDIENT_FAIL,
  DELETE_INGREDIENT_REQUEST, DELETE_INGREDIENT_SUCCESS, DELETE_INGREDIENT_FAIL,
  GET_INGREDIENT_DETAIL_REQUEST,GET_INGREDIENT_DETAIL_SUCCESS,GET_INGREDIENT_DETAIL_FAIL,

  GET_TAGS_REQUEST, GET_TAGS_SUCCESS, GET_TAGS_FAIL,
  CREATE_TAG_REQUEST, CREATE_TAG_SUCCESS, CREATE_TAG_FAIL,
  UPDATE_TAG_REQUEST, UPDATE_TAG_SUCCESS, UPDATE_TAG_FAIL,
  DELETE_TAG_REQUEST, DELETE_TAG_SUCCESS, DELETE_TAG_FAIL,

  GET_EQUIPMENTS_REQUEST, GET_EQUIPMENTS_SUCCESS, GET_EQUIPMENTS_FAIL,
  CREATE_EQUIPMENT_REQUEST, CREATE_EQUIPMENT_SUCCESS, CREATE_EQUIPMENT_FAIL,
  UPDATE_EQUIPMENT_REQUEST, UPDATE_EQUIPMENT_SUCCESS, UPDATE_EQUIPMENT_FAIL,
  DELETE_EQUIPMENT_REQUEST, DELETE_EQUIPMENT_SUCCESS, DELETE_EQUIPMENT_FAIL,
} from '../constants/MetaData';

// INGREDIENTS
export const getAllIngredients = () => async dispatch => {
  try {
    dispatch({ type: GET_INGREDIENTS_REQUEST });
    const res = await apiIngredients.getIngredients();
    dispatch({ type: GET_INGREDIENTS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: GET_INGREDIENTS_FAIL, payload: error.message });
  }
};

export const createIngredient = (data) => async dispatch => {
  try {
    dispatch({ type: CREATE_INGREDIENT_REQUEST });
    const res = await apiIngredients.createIngredient(data);
    dispatch({ type: CREATE_INGREDIENT_SUCCESS, payload: res.data });

    return res.data
  } catch (error) {
    dispatch({ type: CREATE_INGREDIENT_FAIL, payload: error.message });
  }
};

export const updateIngredient = (id, data) => async dispatch => {
  try {
    dispatch({ type: UPDATE_INGREDIENT_REQUEST });
    const res = await apiIngredients.updateIngredient(id, data);
    dispatch({ type: UPDATE_INGREDIENT_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: UPDATE_INGREDIENT_FAIL, payload: error.message });
  }
};

export const deleteIngredient = (id) => async dispatch => {
  try {
    dispatch({ type: DELETE_INGREDIENT_REQUEST });
    await apiIngredients.deleteIngredient(id);
    dispatch({ type: DELETE_INGREDIENT_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_INGREDIENT_FAIL, payload: error.message });
  }
};

export const getIngredientDetail = (id) => async dispatch => {
    try {
      dispatch({ type: GET_INGREDIENT_DETAIL_REQUEST });
      const response = await apiIngredients.getIngredient(id);
      dispatch({ type: GET_INGREDIENT_DETAIL_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: GET_INGREDIENT_DETAIL_FAIL, payload: error.message });
    }
  };

// TAGS
export const getAllTags = () => async dispatch => {
  try {
    dispatch({ type: GET_TAGS_REQUEST });
    const res = await apiTags.getTags();
    dispatch({ type: GET_TAGS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: GET_TAGS_FAIL, payload: error.message });
  }
};

export const createTag = (data) => async dispatch => {
  try {
    dispatch({ type: CREATE_TAG_REQUEST });
    const res = await apiTags.createTag(data);
    dispatch({ type: CREATE_TAG_SUCCESS, payload: res.data });

    return res.data
  } catch (error) {
    dispatch({ type: CREATE_TAG_FAIL, payload: error.message });
  }
};

export const updateTag = (id, data) => async dispatch => {
  try {
    dispatch({ type: UPDATE_TAG_REQUEST });
    const res = await apiTags.updateTag(id, data);
    dispatch({ type: UPDATE_TAG_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: UPDATE_TAG_FAIL, payload: error.message });
  }
};

export const deleteTag = (id) => async dispatch => {
  try {
    dispatch({ type: DELETE_TAG_REQUEST });
    await apiTags.deleteTag(id);
    dispatch({ type: DELETE_TAG_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_TAG_FAIL, payload: error.message });
  }
};

// EQUIPMENTS
export const getAllEquipments = () => async dispatch => {
  try {
    dispatch({ type: GET_EQUIPMENTS_REQUEST });
    const res = await apiEquipments.getEquipments();
    dispatch({ type: GET_EQUIPMENTS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: GET_EQUIPMENTS_FAIL, payload: error.message });
  }
};

export const createEquipment = (data) => async dispatch => {
  try {
    dispatch({ type: CREATE_EQUIPMENT_REQUEST });
    const res = await apiEquipments.createEquipment(data);
    dispatch({ type: CREATE_EQUIPMENT_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: CREATE_EQUIPMENT_FAIL, payload: error.message });
  }
};

export const updateEquipment = (id, data) => async dispatch => {
  try {
    dispatch({ type: UPDATE_EQUIPMENT_REQUEST });
    const res = await apiEquipments.updateEquipment(id, data);
    dispatch({ type: UPDATE_EQUIPMENT_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: UPDATE_EQUIPMENT_FAIL, payload: error.message });
  }
};

export const deleteEquipment = (id) => async dispatch => {
  try {
    dispatch({ type: DELETE_EQUIPMENT_REQUEST });
    await apiEquipments.deleteEquipment(id);
    dispatch({ type: DELETE_EQUIPMENT_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_EQUIPMENT_FAIL, payload: error.message });
  }
};
