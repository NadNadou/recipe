import {
    GET_PLANS_REQUEST,
    GET_PLANS_SUCCESS,
    GET_PLANS_FAIL,
    CREATE_PLAN_REQUEST,
    CREATE_PLAN_SUCCESS,
    CREATE_PLAN_FAIL,
    DELETE_PLAN_SUCCESS
  } from '../constants/Plans';
  
  const initialState = {
    plans: [],
    loading: false,
    error: null,
  };
  
  const plansReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'DELETE_PLAN_SUCCESS':
        return {
          ...state,
          plans: state.plans.filter(p => p._id !== action.payload),
        };

      case GET_PLANS_REQUEST:
      case CREATE_PLAN_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
  
      case GET_PLANS_SUCCESS:
        return {
          ...state,
          loading: false,
          plans: action.payload,
        };
  
      case CREATE_PLAN_SUCCESS:
        return {
          ...state,
          loading: false,
          plans: [...state.plans, action.payload], // ajoute le nouveau plan
        };
  
      case GET_PLANS_FAIL:
      case CREATE_PLAN_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default plansReducer;  