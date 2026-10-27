import { createContext, useState, useEffect, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useFetch } from './hooks/useFetch';
import { AuthContext } from '../auth/context/AuthContext';

export interface Empresa {
    idEmpresa: number;
    nombre: string;
}

export interface Dispositivo {
    numeroSerie: string;
    empresa: number;
    nombre: string;
}

interface ProviderValues {
    empresas: Empresa[];
    dispositivos: Dispositivo[];
}


export const GeneralContext = createContext({} as ProviderValues);


export const GeneralProvider = ({ children }: any) => {

    const { logged, tokenSession } = useContext(AuthContext)

    const fetch = useFetch();

    const { data: empresas } = useQuery({
        queryKey: ["empresas"],
        queryFn: () => fetch.getRequest({ url: `${import.meta.env.VITE_API_EMPRESAS}`, token: tokenSession }),
        enabled: logged,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false
    });
    const { data: dispositivos } = useQuery({
        queryKey: ["dispositivos"],
        queryFn: () => fetch.getRequest({ url: `${import.meta.env.VITE_API_DISPOSITIVOS}`, token: tokenSession }),
        enabled: logged,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false
    });


    return (
        <GeneralContext.Provider value={{
            empresas,
            dispositivos
        }} >
            {children}
        </GeneralContext.Provider>
    )
}