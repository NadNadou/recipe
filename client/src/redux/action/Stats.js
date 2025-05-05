// redux/action/statsAction.js
import apiStats from "../../api/stats"

import {
  GET_WEEKLY_CALORIES_REQUEST,
  GET_WEEKLY_CALORIES_SUCCESS,
  GET_WEEKLY_CALORIES_FAIL
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
