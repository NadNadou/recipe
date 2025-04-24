import { login } from '../../api/auth';

export const loginUser = (email, password) => async dispatch => {
  try {
    const response = await login(email, password);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: response,
    });
  } catch (error) {
    console.error('Erreur login', error);
    // Tu peux dispatcher une action d’erreur ici aussi
  }
};
