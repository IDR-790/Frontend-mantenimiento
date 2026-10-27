/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { PrimeReactProvider } from "primereact/api";
import "primeicons/primeicons.css";
import "primereact/resources/themes/soho-light/theme.css"
import "/node_modules/primeflex/primeflex.css";
import { Router } from "./router/Router.jsx";
import { BrowserRouter } from "react-router-dom";
import { GeneralProvider } from "./shared/GeneralContext";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth";

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient} >
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <AuthProvider>
          <GeneralProvider>
            <PrimeReactProvider>
              <Router />
              <ReactQueryDevtools initialIsOpen={false} />
            </PrimeReactProvider>
          </GeneralProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  // </React.StrictMode> */}
);
