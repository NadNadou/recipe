import {
    GET_WEEKLY_CALORIES_REQUEST,
    GET_WEEKLY_CALORIES_SUCCESS,
    GET_WEEKLY_CALORIES_FAIL
  } from '../constants/Stats';
  
  const initialState = {
    weeklyCalories: [],
    loading: false,
    error: null
  };
  
  const statsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_WEEKLY_CALORIES_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
      case GET_WEEKLY_CALORIES_SUCCESS:
        return {
          ...state,
          loading: false,
          weeklyCalories: action.payload
        };
      case GET_WEEKLY_CALORIES_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default statsReducer;
  