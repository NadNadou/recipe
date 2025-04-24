// src/redux/action/recipe.js
import {
    GET_RECIPES_REQUEST,
    GET_RECIPES_SUCCESS,
    GET_RECIPES_FAIL,
    GET_RECIPE_DETAIL_REQUEST,
    GET_RECIPE_DETAIL_SUCCESS,
    GET_RECIPE_DETAIL_FAIL,
    CREATE_RECIPE_REQUEST,
    CREATE_RECIPE_SUCCESS,
    CREATE_RECIPE_FAIL,
    UPDATE_RECIPE_REQUEST,
    UPDATE_RECIPE_SUCCESS,
    UPDATE_RECIPE_FAIL,
    DELETE_RECIPE_REQUEST,
    DELETE_RECIPE_SUCCESS,
    DELETE_RECIPE_FAIL,
  } from '../constants/Recipe.js';
  
  import api from '../../api/recipes';
  
  // Get all recipes
  export const getAllRecipes = () => async dispatch => {
    try {
      dispatch({ type: GET_RECIPES_REQUEST });
      const response = await api.getRecipes();
      dispatch({ type: GET_RECIPES_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: GET_RECIPES_FAIL, payload: error.message });
    }
  };
  
  // Get one recipe
  export const getRecipeDetail = (id) => async dispatch => {
    try {
      dispatch({ type: GET_RECIPE_DETAIL_REQUEST });
      const response = await api.getRecipe(id);
      dispatch({ type: GET_RECIPE_DETAIL_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: GET_RECIPE_DETAIL_FAIL, payload: error.message });
    }
  };
  
  // Create a recipe
  export const createRecipe = (data) => async dispatch => {
    try {
      dispatch({ type: CREATE_RECIPE_REQUEST });
      const response = await api.createRecipe(data);
      dispatch({ type: CREATE_RECIPE_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: CREATE_RECIPE_FAIL, payload: error.message });
    }
  };
  
  // Update a recipe
  export const updateRecipe = (id, data) => async dispatch => {
    try {
      dispatch({ type: UPDATE_RECIPE_REQUEST });
      const response = await api.updateRecipe(id, data);
      dispatch({ type: UPDATE_RECIPE_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: UPDATE_RECIPE_FAIL, payload: error.message });
    }
  };
  
  // Delete a recipe
  export const deleteRecipe = (id) => async dispatch => {
    try {
      dispatch({ type: DELETE_RECIPE_REQUEST });
      await api.deleteRecipe(id);
      dispatch({ type: DELETE_RECIPE_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: DELETE_RECIPE_FAIL, payload: error.message });
    }
  };
  