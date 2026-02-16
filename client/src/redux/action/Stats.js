// redux/action/statsAction.js
import apiStats from "../../api/stats"

import {
  GET_WEEKLY_CALORIES_REQUEST,
  GET_WEEKLY_CALORIES_SUCCESS,
  GET_WEEKLY_CALORIES_FAIL,
  GET_WEEKLY_INGREDIENTS_REQUEST,
  GET_WEEKLY_INGREDIENTS_SUCCESS,
  GET_WEEKLY_INGREDIENTS_FAIL,
  GET_GROCERY_LIST_REQUEST,
  GET_GROCERY_LIST_SUCCESS,
  GET_GROCERY_LIST_FAIL
} from '../constants/Stats';

export const getWeeklyCalories = () => async dispatch => {
  try {
    dispatch({ type: GET_WEEKLY_CALORIES_REQUEST });

    const res = await apiStats.getWeeklyCalories();

    dispatch({
      type: GET_WEEKLY_CALORIES_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Erreur inconnue lors du chargement des calories hebdomadaires.";

    dispatch({
      type: GET_WEEKLY_CALORIES_FAIL,
      payload: message
    });
  }
};

export const getWeeklyIngredientsByDay = () => async dispatch => {
  try {
    dispatch({ type: GET_WEEKLY_INGREDIENTS_REQUEST });

    const res = await apiStats.getWeeklyIngredientsByDay();

    dispatch({
      type: GET_WEEKLY_INGREDIENTS_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Erreur lors du chargement des ingrédients hebdomadaires.";

    dispatch({
      type: GET_WEEKLY_INGREDIENTS_FAIL,
      payload: message
    });
  }
};

export const getGroceryList = (startDate, endDate) => async dispatch => {
  try {
    dispatch({ type: GET_GROCERY_LIST_REQUEST });

    const res = await apiStats.getGroceryList(startDate, endDate);

    dispatch({
      type: GET_GROCERY_LIST_SUCCESS,
      payload: res.data
    });
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error loading grocery list.";

    dispatch({
      type: GET_GROCERY_LIST_FAIL,
      payload: message
    });
  }
};
