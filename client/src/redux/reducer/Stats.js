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

const initialState = {
  weeklyCalories: [],
  weeklyIngredients: [],
  groceryList: {
    startDate: null,
    endDate: null,
    nonBatchMeals: 0,
    batchSessions: 0,
    ingredients: []
  },
  loading: false,
  groceryLoading: false,
  error: null
};

const statsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WEEKLY_CALORIES_REQUEST:
    case GET_WEEKLY_INGREDIENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GET_GROCERY_LIST_REQUEST:
      return {
        ...state,
        groceryLoading: true,
        error: null
      };

    case GET_WEEKLY_CALORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        weeklyCalories: action.payload
      };

    case GET_WEEKLY_INGREDIENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        weeklyIngredients: action.payload
      };

    case GET_GROCERY_LIST_SUCCESS:
      return {
        ...state,
        groceryLoading: false,
        groceryList: action.payload
      };

    case GET_WEEKLY_CALORIES_FAIL:
    case GET_WEEKLY_INGREDIENTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case GET_GROCERY_LIST_FAIL:
      return {
        ...state,
        groceryLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default statsReducer;
