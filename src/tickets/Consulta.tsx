import React, { useState, useRef, useEffect, useCallback, useMemo, useContext } from 'react';
import { Toast } from 'primereact/toast';
import { Nullable } from 'primereact/ts-helpers';

import { Ticket, EquipoSistema } from './types/ticket.types';
import { OptionsEstado, OptionsEco } from './types/consulta.types';
import { addLocaleCalendar } from './types/calendar.addlocal';
import { AuthContext } from '../auth/context/AuthContext';
import { GeneralContext } from '../shared/GeneralContext';
import { useFetch } from '../shared/hooks/useFetch';

import {
    fetchCatalogosFallas,
    fetchTicketsConsulta,
    fecthOptionsEstado,
    fecthOptionsEco
} from './components/consulta/service';
import {
    OPTIONS_TIPOS,
    calcularMetricas,
    filtrarTickets
} from './utils/consulta.utils';

import { ConsultaToolbar } from './components/consulta/ConsultaToolbar';
import { ConsultaMetricas } from './components/consulta/ConsultaMetricas';
import { TecnicoResumenCards } from '../tecnicos/components/TecnicoResumenCards';
import { ConsultaTable } from './components/consulta/ConsultaTable';
import { ConsultaEmptyState } from './components/consulta/ConsultaEmptyState';

export const Consulta = () => {
    addLocaleCalendar();

    // ─── Estado principal ───
    const [allTickets, setAllTickets] = useState<Ticket[]>([]);
    const [ticketsFiltrados, setTicketsFiltrados] = useState<Ticket[]>([]);
    const [listaElementosFallas, setListaElementosFallas] = useState<EquipoSistema[]>([]);
    const [haBuscado, setHaBuscado] = useState<boolean>(false);
    const [cargando, setCargando] = useState<boolean>(false);

    // ─── Filtros ───
    const [filtroFechaDesde, setFiltroFechaDesde] = useState<Nullable<Date>>(null);
    const [filtroFechaHasta, setFiltroFechaHasta] = useState<Nullable<Date>>(null);
    const [filtroEmpresa, setFiltroEmpresa] = useState<number | null>(null);
    const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
    const [filtroEstado, setFiltroEstado] = useState<number | null>(null);
    const [filtroEco, setFiltroEco] = useState<number | string | null>(null);

    const [optionsEstado, setOptionsEstado] = useState<OptionsEstado[]>([]);
    const [optionsEco, setOptionsEco] = useState<OptionsEco[]>([]);

    const toast = useRef<Toast>(null);

    const { empresas } = useContext(GeneralContext);
    const { tokenSession } = useContext(AuthContext);
    const TOKEN = tokenSession?.token ?? '';
    const { getRequest } = useFetch();

    const optionsEmpresas = useMemo(
        () =>
            empresas.map((empresa) => ({
                label: empresa.nombre,
                value: empresa.idEmpresa
            })),
        [empresas]
    );

    // // ─── Métricas calculadas sobre ticketsFiltrados ───
    // const metricas = useMemo(() => {
    //     return calcularMetricas(ticketsFiltrados);
    // }, [ticketsFiltrados]);

    // ─── Carga de catálogos desde el Backend ───
    const cargarCatalogos = useCallback(async () => {
        try {
            const fallasData = await fetchCatalogosFallas(TOKEN, getRequest);
            setListaElementosFallas(fallasData);

            const estadosData = await fecthOptionsEstado(TOKEN, getRequest);
            setOptionsEstado(estadosData);

            const ecoData = await fecthOptionsEco(TOKEN, getRequest);
            setOptionsEco(ecoData);
        } catch (error: any) {
            console.error(error);
            const detail = (error?.status === 413 || error?.message === 'Error de conexión')
                ? 'Error de conexión'
                : 'Error al cargar los catálogos de fallas';
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail,
                life: 5000
            });
        }
    }, [TOKEN, getRequest]);

    useEffect(() => {
        if (TOKEN) {
            cargarCatalogos();
        }
    }, [TOKEN, cargarCatalogos]);

    // ─── Lógica de filtrado y consulta explícita ───
    const aplicarFiltros = async () => {
        setCargando(true);
        try {
            const resTickets = await fetchTicketsConsulta(TOKEN, getRequest);
            if (resTickets) {
                setAllTickets(resTickets);

                const resultado = filtrarTickets(resTickets, {
                    filtroFechaDesde,
                    filtroFechaHasta,
                    filtroEmpresa,
                    filtroTipo,
                    filtroEstado,
                    filtroEco
                });

                setTicketsFiltrados(resultado);
                setHaBuscado(true);

                toast.current?.show({
                    severity: resultado.length > 0 ? 'info' : 'warn',
                    summary: 'Búsqueda realizada',
                    detail: `Se encontraron ${resultado.length} ticket(s) con los filtros aplicados.`,
                    life: 3000
                });
            } else {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'No se recibieron datos de tickets',
                    life: 5000
                });
            }
        } catch (error: any) {
            console.error(error);
            const detail = (error?.status === 413 || error?.message === 'Error de conexión')
                ? 'Error de conexión'
                : 'Error al realizar la consulta de tickets';
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail,
                life: 5000
            });
        } finally {
            setCargando(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltroFechaDesde(null);
        setFiltroFechaHasta(null);
        setFiltroEmpresa(null);
        setFiltroTipo(null);
        setFiltroEstado(null);
        setFiltroEco(null);
        setTicketsFiltrados([]);
        setHaBuscado(false);
    };

    return (
        <div className="card p-4">
            <Toast ref={toast} />

            {/* Barra de herramientas / Filtros */}
            <ConsultaToolbar
                filtroFechaDesde={filtroFechaDesde}
                filtroFechaHasta={filtroFechaHasta}
                filtroEmpresa={filtroEmpresa}
                filtroTipo={filtroTipo}
                filtroEstado={filtroEstado}
                filtroEco={filtroEco}
                optionsEmpresas={optionsEmpresas}
                optionsTipos={OPTIONS_TIPOS}
                optionsEstado={optionsEstado}
                optionsEco={optionsEco}
                cargando={cargando}
                onFechaDesdeChange={setFiltroFechaDesde}
                onFechaHastaChange={setFiltroFechaHasta}
                onEmpresaChange={setFiltroEmpresa}
                onTipoChange={setFiltroTipo}
                onEstadoChange={setFiltroEstado}
                onEcoChange={setFiltroEco}
                onBuscar={aplicarFiltros}
                onLimpiar={limpiarFiltros}
            />

            {haBuscado ? (
                <>
                    {/* Tarjetas de métricas */}
                    <TecnicoResumenCards tickets={ticketsFiltrados} />

                    {/* Tabla de resultados */}
                    <ConsultaTable
                        tickets={ticketsFiltrados}
                        cargando={cargando}
                        listaElementosFallas={listaElementosFallas}
                        empresas={optionsEmpresas}
                    />
                </>
            ) : (
                <ConsultaEmptyState />
            )}
        </div>
    );
};