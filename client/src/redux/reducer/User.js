const initialState = {
    currentUser: null,
    token: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          currentUser: action.payload.user,
          token: action.payload.token,
        };
      case 'LOGOUT':
        return {
          ...state,
          currentUser: null,
          token: null,
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  