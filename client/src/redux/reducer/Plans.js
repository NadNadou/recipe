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

const initialState = {
  plans: [],
  batchSessions: [],
  loading: false,
  error: null,
};

const plansReducer = (state = initialState, action) => {
  switch (action.type) {
    // Plans
    case GET_PLANS_REQUEST:
    case CREATE_PLAN_REQUEST:
    case GET_BATCH_SESSIONS_REQUEST:
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
        plans: [...state.plans, action.payload],
      };

    case DELETE_PLAN_SUCCESS:
      return {
        ...state,
        plans: state.plans.filter(p => p._id !== action.payload),
      };

    case UPDATE_PLAN_SUCCESS:
    case UPDATE_PLAN_DATE_SUCCESS:
      return {
        ...state,
        plans: state.plans.map(p =>
          p._id === action.payload._id ? action.payload : p
        ),
      };

    case GET_PLANS_FAIL:
    case CREATE_PLAN_FAIL:
    case GET_BATCH_SESSIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Batch Sessions
    case GET_BATCH_SESSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        batchSessions: action.payload,
      };

    case CREATE_BATCH_SESSION_SUCCESS:
      return {
        ...state,
        batchSessions: [...state.batchSessions, action.payload],
      };

    case DELETE_BATCH_SESSION_SUCCESS:
      return {
        ...state,
        batchSessions: state.batchSessions.filter(s => s._id !== action.payload),
      };

    case UPDATE_BATCH_SESSION_SUCCESS:
      return {
        ...state,
        batchSessions: state.batchSessions.map(s =>
          s._id === action.payload._id ? action.payload : s
        ),
      };

    default:
      return state;
  }
};

export default plansReducer;