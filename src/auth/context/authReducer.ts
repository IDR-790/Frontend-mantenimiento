import { AuthAction, AuthState, types } from "../types";


export const authReducer = ( state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case types.login:
      return {
        ...state,
        logged: true,
        user: action.payload,
      };

    case types.logout:
      return {
        logged: false,
        user: null,
      };

    default:
      return state;
  }
};