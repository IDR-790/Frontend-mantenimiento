import { Ticket, EquipoSistema, EmpresaOption } from '../types/ticket.types';
import { FiltrosConsulta, MetricasConsulta, OptionItem } from '../types/consulta.types';

export const OPTIONS_TIPOS: OptionItem<string>[] = [
    { label: 'Interno', value: 'I' },
    { label: 'Externo', value: 'E' },
    { label: 'TI', value: 'TI' }
];

export const obtenerFechaNormalizada = (dateInput: string | Date | null | undefined): Date | null => {
    if (!dateInput) return null;
    if (dateInput instanceof Date) {
        return isNaN(dateInput.getTime()) ? null : dateInput;
    }

    const str = String(dateInput).trim();
    if (!str) return null;

    // Formato ISO: YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss o YYYY-MM-DD HH:mm:ss
    const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (isoMatch) {
        const year = parseInt(isoMatch[1], 10);
        const month = parseInt(isoMatch[2], 10) - 1;
        const day = parseInt(isoMatch[3], 10);
        const hours = isoMatch[4] ? parseInt(isoMatch[4], 10) : 0;
        const minutes = isoMatch[5] ? parseInt(isoMatch[5], 10) : 0;
        const seconds = isoMatch[6] ? parseInt(isoMatch[6], 10) : 0;
        return new Date(year, month, day, hours, minutes, seconds);
    }

    // Formato DMY: DD/MM/YYYY
    const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
    if (dmyMatch) {
        const day = parseInt(dmyMatch[1], 10);
        const month = parseInt(dmyMatch[2], 10) - 1;
        const year = parseInt(dmyMatch[3], 10);
        const hours = dmyMatch[4] ? parseInt(dmyMatch[4], 10) : 0;
        const minutes = dmyMatch[5] ? parseInt(dmyMatch[5], 10) : 0;
        const seconds = dmyMatch[6] ? parseInt(dmyMatch[6], 10) : 0;
        return new Date(year, month, day, hours, minutes, seconds);
    }

    const fallbackDate = new Date(str);
    return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
};

export const filtrarTickets = (
    allTickets: Ticket[],
    filtros: FiltrosConsulta
): Ticket[] => {
    if (!Array.isArray(allTickets)) return [];

    let resultado = [...allTickets];

    if (filtros.filtroFechaDesde) {
        const desde = new Date(filtros.filtroFechaDesde);
        desde.setHours(0, 0, 0, 0);
        resultado = resultado.filter(t => {
            const fechaTicket = obtenerFechaNormalizada(t.createdAt);
            if (!fechaTicket) return false;
            return fechaTicket >= desde;
        });
    }

    if (filtros.filtroFechaHasta) {
        const hasta = new Date(filtros.filtroFechaHasta);
        hasta.setHours(23, 59, 59, 999);
        resultado = resultado.filter(t => {
            const fechaTicket = obtenerFechaNormalizada(t.createdAt);
            if (!fechaTicket) return false;
            return fechaTicket <= hasta;
        });
    }

    if (filtros.filtroEmpresa !== null && filtros.filtroEmpresa !== undefined && (filtros.filtroEmpresa as any) !== '') {
        const rawEmpresa = typeof filtros.filtroEmpresa === 'object' && filtros.filtroEmpresa !== null
            ? (filtros.filtroEmpresa as any).value
            : filtros.filtroEmpresa;
        const idEmpresaBuscada = Number(rawEmpresa);
        if (!isNaN(idEmpresaBuscada)) {
            resultado = resultado.filter(t => Number(t.idEmpresa) === idEmpresaBuscada);
        }
    }

    if (filtros.filtroTipo !== null && filtros.filtroTipo !== undefined && filtros.filtroTipo !== '') {
        const rawTipo = typeof filtros.filtroTipo === 'object' && filtros.filtroTipo !== null
            ? (filtros.filtroTipo as any).value
            : filtros.filtroTipo;
        const tipoFiltro = String(rawTipo).trim().toUpperCase();
        resultado = resultado.filter(t => {
            if (!t.tipo) return false;
            const tipoTicket = String(t.tipo).trim().toUpperCase();
            if (tipoFiltro === 'T' || tipoFiltro === 'TI') {
                return tipoTicket === 'T' || tipoTicket === 'TI';
            }
            return tipoTicket === tipoFiltro;
        });
    }

    if (filtros.filtroEstado !== null && filtros.filtroEstado !== undefined && (filtros.filtroEstado as any) !== '') {
        const rawEstado = typeof filtros.filtroEstado === 'object' && filtros.filtroEstado !== null
            ? (filtros.filtroEstado as any).value
            : filtros.filtroEstado;
        const estadoBuscado = Number(rawEstado);
        if (!isNaN(estadoBuscado)) {
            resultado = resultado.filter(t => {
                const idEst = (t as any).idEstado ?? (t as any).idEstadoTicket ?? (t as any).idCatEstadoTicket;
                return Number(idEst) === estadoBuscado;
            });
        }
    }

    if (filtros.filtroEco !== null && filtros.filtroEco !== undefined && (filtros.filtroEco as any) !== '') {
        const rawEco = typeof filtros.filtroEco === 'object' && filtros.filtroEco !== null
            ? (filtros.filtroEco as any).value
            : filtros.filtroEco;

        const strEcoFiltro = String(rawEco).trim().toUpperCase();

        if (strEcoFiltro === 'N/A') {
            resultado = resultado.filter(t => {
                const ecoVal = (t as any).eco ?? (t as any).idEco;
                if (ecoVal === null || ecoVal === undefined) return true;
                const strEco = String(ecoVal).trim();
                return strEco === '' || strEco.toUpperCase() === 'N/A';
            });
        } else {
            const ecoBuscadoNum = Number(rawEco);
            resultado = resultado.filter(t => {
                const ecoVal = (t as any).eco ?? (t as any).idEco;
                if (ecoVal === null || ecoVal === undefined) return false;
                if (!isNaN(ecoBuscadoNum) && !isNaN(Number(ecoVal))) {
                    return Number(ecoVal) === ecoBuscadoNum;
                }
                return String(ecoVal).trim().toUpperCase() === strEcoFiltro;
            });
        }
    }

    return resultado;
};

export const buscarEquipoNombre = (
    rowData: Ticket,
    listaElementosFallas: EquipoSistema[]
): string => {
    const equipoEncontrado = listaElementosFallas.find(equipo =>
        equipo.elementos?.some(elemento =>
            elemento.fallas?.some(
                falla =>
                    falla.idCatFallaElementoEquipoSistema ===
                    rowData.idCatFallaElementoEquipoSistema
            )
        )
    );
    return equipoEncontrado
        ? equipoEncontrado.nombre
        : `ID: ${rowData.idCatFallaElementoEquipoSistema}`;
};

export const buscarFallaDescripcion = (
    rowData: Ticket,
    listaElementosFallas: EquipoSistema[]
): string => {
    let fallaEncontrada: any = null;
    for (const sistema of listaElementosFallas) {
        for (const elemento of sistema.elementos || []) {
            const target = (elemento.fallas || []).find(
                (f: any) =>
                    f.idCatFallaElementoEquipoSistema ===
                    rowData.idCatFallaElementoEquipoSistema
            );
            if (target) {
                fallaEncontrada = target;
                break;
            }
        }
        if (fallaEncontrada) break;
    }
    return fallaEncontrada
        ? fallaEncontrada.descripcion
        : `ID Falla: ${rowData.idCatFallaElementoEquipoSistema}`;
};

export const formatearFechaConsulta = (createdAt?: string | null): string => {
    if (!createdAt) return 'N/A';
    return createdAt.split('T')[0];
};

export const obtenerAreaAtencionTexto = (rowData: Ticket): string => {
    return rowData.AreaAtencion!;
};

export const buscarEmpresaNombre = (
    idEmpresa: number,
    empresas: EmpresaOption[]
): string => {
    const empresaEncontrada = empresas?.find((empresa) => empresa.value === idEmpresa);
    return empresaEncontrada ? empresaEncontrada.label : idEmpresa ? String(idEmpresa) : 'N/A';
};

