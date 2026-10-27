export const types = {
  login: "[Auth] Login",
  logout: "[Auth] Logout",
} as const;

export interface UserRequest {
  email: string;
  password: string;
} 

export interface AuthState {
  logged: boolean;
  user: UserRequest | null;
}

export type AuthAction =
  | { type: typeof types.login; payload: UserRequest }
  | { type: typeof types.logout };