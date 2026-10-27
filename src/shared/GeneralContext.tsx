import { createContext, useState, useEffect, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useFetch } from './hooks/useFetch';
import { AuthContext } from '../auth/context/AuthContext';

export interface Empresa {
    idEmpresa: number;
    nombre: string;
}

interface ProviderValues {
    empresas: Empresa[];
}

export const GeneralContext = createContext({} as ProviderValues);


export const GeneralProvider = ({ children }: any) => {

    const { logged, tokenSession,permisosUser, setPermisosUser } = useContext(AuthContext)
    const fetch = useFetch();
    
    const { data: empresasAll = [] } = useQuery({
        queryKey: ["empresas"],
        queryFn: () => fetch.getRequest({ url: `${import.meta.env.VITE_AUTH_EMPRESA}`, token: tokenSession?.token ?? '' }),
        enabled: logged,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false
    });

    const empresas = tokenSession?.idEmpresa === 1
        ? empresasAll
        : empresasAll.filter(
            (empresa: Empresa) =>
                empresa.idEmpresa ===
                tokenSession?.idEmpresa
        );

    return (
        <GeneralContext.Provider value={{
            empresas,
            // dispositivos
        }} >
            {children}
        </GeneralContext.Provider>
    )
}