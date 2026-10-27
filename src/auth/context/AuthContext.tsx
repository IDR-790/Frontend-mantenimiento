import { createContext } from "react";
import { AuthState, UserRequest } from "../types";

export interface AuthContextProps extends AuthState {
  login: (user: UserRequest) => void;
  logout: () => void;

  permisosUser: Record<string, any>;
  setPermisosUser: React.Dispatch<React.SetStateAction<Record<string, any>>>;

  tokenExp: boolean;
  setTokenExp: React.Dispatch<React.SetStateAction<boolean>>;
  tokenSession: string;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);