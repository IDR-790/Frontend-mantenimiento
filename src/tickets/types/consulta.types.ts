export interface OptionsEstado {
    label?: string;
    value?: number;
}

export interface FiltrosConsulta {
    filtroFechaDesde: Date | null;
    filtroFechaHasta: Date | null;
    filtroEmpresa: number | null;
    filtroTipo: string | null;
    filtroEstado: number | null;
    filtroEco: number | string | null;
}

// export interface MetricasConsulta {
//     total: number;
//     abiertos: number;
//     enRefaccion: number;
//     cerrados: number;
//     enAtencion: number;
// }

export interface OptionItem<T = string | number> {
    label: string;
    value: T;
}

export interface OptionsEco {
    value: number | string;
    label: string | number;
    estatus?: string;
    idEmpresa: number;
}