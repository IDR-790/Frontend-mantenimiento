import { Route, Routes } from "react-router-dom";
import { AuthContext, PrivateRoute, PublicRoute } from '../auth';
import { LoginRoutes } from "./LoginRoutes";
import { HomeRoutes } from "./HomeRoutes";
import { useContext } from "react";

export const Router = () => {
  const { user } = useContext(AuthContext)

  return (
    <>
      <Routes>
        {user ?
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <HomeRoutes />
              </PrivateRoute>
            }
          />
          :
          <Route
            path="/*"
            element={
              <PublicRoute>
                <LoginRoutes />
              </PublicRoute>
            }
          />
        }
      </Routes>
    </>
  );
};
