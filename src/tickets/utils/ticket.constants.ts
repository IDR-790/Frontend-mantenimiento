import { Ticket } from '../types/ticket.types';

export const EMPTY_TICKET: Ticket = {
    idTicket: 0,
    idEmpresa: 0,
    nombreEmpresa: '',
    idAreaAtencion: 0,
    idCatFallaElementoEquipoSistema: 0,
    eco: null,
    evidencia: null,
    observaciones: '',
    idEstado: 0,
    tipo: '',
    archivo: null,
    codigo: '',
    aho: 0,
    consecutivo: 0,
    fechaAtencion: null,
    fechaCierre: null
};
