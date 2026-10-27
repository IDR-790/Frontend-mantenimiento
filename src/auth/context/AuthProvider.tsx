import { useReducer, useState, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";
import { AuthState, UserRequest, types } from "../types";
import { useFetch } from "../../shared/hooks/useFetch";

interface Props {
  children: ReactNode;
}

const init = (): AuthState => { 
  const user = JSON.parse(sessionStorage.getItem("session") || "null");

  return {
    logged: !!user,
    user: user,
  };
};

export const AuthProvider = ({ children }: Props) => {
  const queryClient = useQueryClient(); 
  const fetch = useFetch();
  const emailRegex = new RegExp(import.meta.env.VITE_EMAIL_REGEX) 

  const [tokenExp, setTokenExp] = useState<boolean>(false);

  const tokenSession = JSON.parse(sessionStorage.getItem("session") || "null");

  const initialState: AuthState = {
    logged: false,
    user: null
  }

  const [authState, dispatch] = useReducer(authReducer, initialState, init);

  const login = async (user: UserRequest): Promise<string> => {
    setTokenExp(false);
    if (!emailRegex.test(user.email)){return "Ingrese un usuario válido"}

    const action = {
      type: types.login,
      payload: user,
    };

    const json = {
      email: user.email,
      password: user.password
    }
    // const message = await fetch.postRequest({ url:`${import.meta.env.VITE_API_AUTH}`, json, token:''})
    const token = import.meta.env.VITE_TOKEN_EMPRESAS_ADMIN

    sessionStorage.setItem("session", JSON.stringify(token));

    dispatch(action);
    return "message"
  };

  const logout = () => {
    queryClient.clear();
    sessionStorage.removeItem("session");
    dispatch({ type: types.logout });
  };

  const [permisosUser, setPermisosUser] = useState<Record<string, any>>({});

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        permisosUser,
        setPermisosUser,
        tokenExp,
        setTokenExp,
        tokenSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};