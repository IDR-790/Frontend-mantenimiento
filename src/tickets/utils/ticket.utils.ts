import { Ticket } from '../types/ticket.types';

export const getTipoTicket = (
    idAreaAtencion: number,
    tipoTicketUsuario: string
): string => {
    if (idAreaAtencion === 1) return tipoTicketUsuario;
    if (idAreaAtencion === 2) return 'TI';
    return 'X';
};

export const getAreaAtencionNombre = (ticket: Ticket): string => {
    if (!ticket.AreaAtencion) {
        return `ID: ${ticket.idAreaAtencion}`;
    }

    if (typeof ticket.AreaAtencion === 'string') {
        return ticket.AreaAtencion;
    }

    return ticket.AreaAtencion.nombre;
};
