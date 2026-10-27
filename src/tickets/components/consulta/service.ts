import { EquipoSistema, TicketsFichas, Ticket, EvidenciaFicha } from '../../types/ticket.types';
import { OptionsEstado, OptionsEco } from '../../types/consulta.types';

const URL = import.meta.env.VITE_API_TICKETS;

/**
 * Obtiene el catálogo de elementos y fallas de equipos
 */
export async function fetchCatalogosFallas(
    token: string,
    getRequest: (params: { url: string; token: string }) => Promise<any>
): Promise<EquipoSistema[]> {
    try {
        const resFallas = await getRequest({
            url: `${URL}/falla-equipo-sistema`,
            token
        });
        return resFallas;
    } catch (error) {
        console.error('Error al cargar catálogos de fallas:', error);
        throw error;
    }
}

/**
 * Obtiene los tickets registrados para la consulta
 */
export async function fetchTicketsConsulta(
    token: string,
    getRequest: (params: { url: string; token: string }) => Promise<any>
): Promise<Ticket[]> {
    try {
        const resTickets = await getRequest({
            url: `${URL}/tickets`,
            token
        });
        return resTickets || [];
    } catch (error) {
        console.error('Error al obtener los tickets para la consulta:', error);
        throw error;
    }
}

/**
 * Obtiene o provee las opciones de estados de tickets
 */
export async function fetchOptionsEstado(
    token?: string,
    getRequest?: (params: { url: string; token: string }) => Promise<any>
): Promise<OptionsEstado[]> {
    // Si en el futuro existe un endpoint para catálogos de estados:
    if (token && getRequest) {
        try {
            const res = await getRequest({
                url: `${URL}/tickets/ver-estados`,
                token
            });
            const estados = res.map((estado: any) => ({
                value: estado.idEstadoTicket,
                label: estado.descripcion
            }));
            return estados;

        } catch (error) {
            console.error('Error al obtener los estados: ', error);

        }
    }
    return [];
}

export async function fecthOptionsEco(
    token?: string,
    getRequest?: (params: { url: string; token: string }) => Promise<any>,
    idEmpresa?: number
): Promise<OptionsEco[]> {
    if (token && getRequest) {
        try {
            const res = await getRequest({
                url: `${URL}/eco`,
                token
            });
            let optionsEco: OptionsEco[] = res.map((eco: any) => ({
                value: eco.idEco,
                label: eco.numero,
                estatus: eco.estatus,
                idEmpresa: eco.idEmpresa
            }));
            if (idEmpresa) {
                optionsEco = optionsEco.filter((eco) => eco.idEmpresa === idEmpresa);
            }
            return optionsEco;

        } catch (error) {
            console.error('Error al obtener las opciones de eco: ', error);

        }
    }
    return [];
}

const parseEvidencias = (evidencia: any): string[] => {
    try {
        const data = typeof evidencia === 'string' && evidencia.trim().startsWith('[')
            ? JSON.parse(evidencia)
            : evidencia;
        return (Array.isArray(data) ? data : [data])
            .map((item) => (typeof item === 'string' ? item : item?.nombre))
            .filter(Boolean);
    } catch {
        return typeof evidencia === 'string' && evidencia.trim() ? [evidencia.trim()] : [];
    }
};

export async function fetchFichasPorTicket(
    token?: string,
    getRequest?: (params: { url: string; token: string }) => Promise<any>,
    idTicket?: number
): Promise<TicketsFichas[]> {
    if (token && getRequest && idTicket) {
        try {
            const res = await getRequest({
                url: `${URL}/ficha/FichasTicket/${idTicket}`,
                token
            });

            return (res || []).map((ficha: any): TicketsFichas => ({
                idTicket: ficha.idTicket,
                idFichaTecnica: ficha.idFicha,
                fechaCierre: ficha.fechaCierre,
                fechaAtencion: ficha.fechaAtencion,
                evidencia: ficha.evidencia || null,
                evidencias: parseEvidencias(ficha.evidencia || ficha.evidencias),
                observaciones: ficha.observaciones,
                estadoFicha: {
                    idEstadoFicha: ficha.estadoFicha?.idEstadoFicha,
                    descripcion: ficha.estadoFicha?.descripcion
                },
                falla: {
                    idCatFallaElementoEquipoSistema: ficha.fallaEquipoSistema?.idCatFallaElementoEquipoSistema,
                    idCatFalla: ficha.fallaEquipoSistema?.idCatFalla,
                    descripcion: ficha.fallaEquipoSistema?.falla?.descripcion
                },
                elemento: {
                    idElementoEquipoSistema: ficha.fallaEquipoSistema?.elemento?.idElementoEquipoSistema,
                    nombre: ficha.fallaEquipoSistema?.elemento?.nombre,
                    Equipo: {
                        idEquipoSistema: ficha.fallaEquipoSistema?.elemento?.equipoSistema?.idEquipoSistema,
                        nombre: ficha.fallaEquipoSistema?.elemento?.equipoSistema?.nombre
                    }
                },
                detalles: ficha.detalles
                    ? ficha.detalles.map((detalle: any) => ({
                        idFichaDetalle: detalle.idFichaDetalle,
                        diagnostico: detalle.diagnostico?.diagnostico
                            ? [
                                {
                                    idDiagnostico: detalle.diagnostico.diagnostico.idDiagnostico,
                                    descripcion: detalle.diagnostico.diagnostico.descripcion
                                }
                            ]
                            : [],
                        reparacion: detalle.reparacion?.reparacion
                            ? [
                                {
                                    idReparacion: detalle.reparacion.reparacion.idReparacion,
                                    descripcion: detalle.reparacion.reparacion.descripcion
                                }
                            ]
                            : null,
                        refacciones: detalle.refacciones
                            ? detalle.refacciones.map((refaccion: any) => ({
                                idEsperaRefaccion: refaccion.idEsperaRefaccion,
                                idFichaDetalle: refaccion.idFichaDetalle,
                                pieza: refaccion.pieza,
                                estatus: refaccion.estatus,
                                createdAt: refaccion.createdAt || null,
                                createdUser: refaccion.createdUser || null,
                                updatedAt: refaccion.updatedAt || null,
                                updatedUser: refaccion.updatedUser || null,
                                deletedAt: refaccion.deletedAt || null,
                                deletedUser: refaccion.deletedUser || null,
                                idEstadoRefaccion: refaccion.idEstadoRefaccion,
                                estadoRefaccion: refaccion.estadoRefaccion
                            }))
                            : null
                    }))
                    : null
            }));
        } catch (error) {
            console.error('Error al obtener las fichas por ticket: ', error);
            throw error;
        }
    }
    return [];
}

/**
 * Consulta la evidencia (imagen) desde el endpoint de la API
 */
export async function fetchEvidenciaImagen(
    token?: string,
    _getRequest?: (params: { url: string; token: string }) => Promise<any>,
    nombreArchivo?: string
): Promise<string> {
    if (!nombreArchivo) return '';
    if (/^(https?:|data:|blob:)/.test(nombreArchivo)) return nombreArchivo;

    try {
        const file = nombreArchivo.split('/').pop()!;
        const res = await fetch(`${URL}/ficha/evidencia/${encodeURIComponent(file)}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!res.ok) return '';
        const type = res.headers.get('content-type') || '';
        if (type.includes('application/json')) {
            const data = await res.json();
            return data?.url || data?.imagen || '';
        }

        return window.URL.createObjectURL(await res.blob());
    } catch {
        return '';
    }
}

// Exportación con el nombre typo utilizado previamente para evitar compatibilidad rota
export const fecthOptionsEstado = fetchOptionsEstado;
export const fetchOptionsEco = fecthOptionsEco;
export const fecthFichasPorTicket = fetchFichasPorTicket;
export const fecthEvidenciaImagen = fetchEvidenciaImagen;




