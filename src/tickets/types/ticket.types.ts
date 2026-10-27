export interface AreaAtencion {
    idAreaAtencion: number;
    nombre: string;
}

export interface Falla {
    idCatFallaElementoEquipoSistema: number;
    descripcion: string;
    idAreaAtencion: number;
}

export interface ElementoSistema {
    idElementoEquipoSistema: number;
    nombre: string;
    eco: boolean;
    fallas: Falla[];
}

export interface EquipoSistema {
    idEquipoSistema: number;
    nombre: string;
    elementos: ElementoSistema[];
}

export interface Ticket {
    idTicket: number;
    idEmpresa: number;
    nombreEmpresa: string;

    idAreaAtencion: number;
    idCatFallaElementoEquipoSistema: number;

    eco: number | string | null;
    evidencia: string | null;
    observaciones: string;

    idEstado: number;
    tipo: string;

    codigo: string;
    aho: number;
    consecutivo: number;

    fechaAtencion: Date | string | null;
    fechaCierre: Date | string | null;
    createdAt?: string | null;

    archivo: File | null;

    fallaTexto?: string;
    falla?: string;
    AreaAtencion?: string;
}

export interface EmpresaOption {
    label: string;
    value: number;
}

export interface FallaDTO {
    idCatFallaElementoEquipoSistema?: number;
    idCatFalla?: number;
    descripcion?: string;
}

export interface EstadoFicha {
    idEstadoFicha: number;
    descripcion: string;
}

export interface Equipo {
    idEquipoSistema: number;
    nombre: string;
}

export interface Elemento {
    idElementoEquipoSistema: number;
    nombre: string;
    Equipo?: Equipo;
}

export interface Diagnostico {
    idDiagnostico: number;
    descripcion: string;
}

export interface Reparacion {
    idReparacion: number;
    descripcion: string;
}

export interface EstadoRefaccion {
    idEstadoRefaccion: number;
    descripcion: string;
}

export interface Refacion {
    idEsperaRefaccion: number;
    idFichaDetalle?: number;
    pieza: string;
    estatus?: boolean;
    createdAt?: string | Date | null;
    createdUser?: number | null;
    updatedAt?: string | Date | null;
    updatedUser?: number | null;
    deletedAt?: string | Date | null;
    deletedUser?: number | null;
    idEstadoRefaccion?: number;
    estadoRefaccion?: EstadoRefaccion | null;
}

export interface DetallesTicket {
    idFichaDetalle: number;
    diagnostico: Diagnostico[];
    reparacion: Reparacion[] | null;
    refacciones: Refacion[] | null;
}

export interface EvidenciaFicha {
    nombre: string;
    url?: string;
}

export interface TicketsFichas {
    idTicket: number;
    idFichaTecnica: number;
    fechaCierre: string | Date | null;
    fechaAtencion: string | Date | null;
    evidencia?: string | null;
    evidencias?: string[] | null;
    observaciones?: string | null;
    estadoFicha?: EstadoFicha | null;
    falla?: FallaDTO | null;
    elemento?: Elemento | null;
    detalles?: DetallesTicket[] | null;
}