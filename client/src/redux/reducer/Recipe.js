import {
  GET_RECIPES_REQUEST,
  GET_RECIPES_SUCCESS,
  GET_RECIPES_FAIL,
  GET_RECIPE_DETAIL_REQUEST,
  GET_RECIPE_DETAIL_SUCCESS,
  GET_RECIPE_DETAIL_FAIL,
  CREATE_RECIPE_SUCCESS,
  UPDATE_RECIPE_SUCCESS,
  DELETE_RECIPE_SUCCESS,
  TOGGLE_UPDATE_RECIPE,
  DUPLICATE_RECIPE_REQUEST,
  DUPLICATE_RECIPE_SUCCESS,
  DUPLICATE_RECIPE_FAIL,
} from '../constants/Recipe';

const initialState = {
  recipes: [],
  recipeDetail: null,
  loading: false,
  updateRecipe:false,
  error: null,
};

const recipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RECIPES_REQUEST:
    case GET_RECIPE_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_RECIPES_SUCCESS:
      return {
        ...state,
        loading: false,
        recipes: action.payload,
      };
    case GET_RECIPE_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        recipeDetail: action.payload,
      };
    case GET_RECIPES_FAIL:
    case GET_RECIPE_DETAIL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CREATE_RECIPE_SUCCESS:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };
    case UPDATE_RECIPE_SUCCESS:
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe._id === action.payload._id ? action.payload : recipe
        ),
       
      };
    case DELETE_RECIPE_SUCCESS:
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe._id !== action.payload),
      };

    case TOGGLE_UPDATE_RECIPE : 
      return {
        ...state,
        updateRecipe:!state.updateRecipe
      };

      case DUPLICATE_RECIPE_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case DUPLICATE_RECIPE_SUCCESS:
        return {
          ...state,
          loading: false,
          recipes: [...state.recipes, action.payload],
        };
      case DUPLICATE_RECIPE_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
        
      default:
        return state;
  }
};

export default recipeReducer;
