import { io, Socket } from 'socket.io-client';

// Eventos para actualizar las tablas de tickets y tecnicos
export type TicketEventType =
  | 'ticket_liberado'
  | 'atencion_iniciada'
  | 'espera_refaccion'
  | 'ticket_cerrado';

// Eventos para las notificaciones
export type TicketNotificationEvent =
  | 'ticket:created'
  | 'espera_refaccion'
  | 'ticket_cerrado';

export interface TicketInboxNotification {
  id: number;
  codigo: string;
  evento: TicketNotificationEvent;
  receivedAt: Date;
}
export interface TicketCreatedPayload {
  codigo?: string | number;
  falla?: string;
  idEmpresa?: number;
  idTicket?: number;
  [key: string]: any;
}

export interface TicketUpdatedPayload {
  idTicket?: number;
  idEmpresa?: number;
  codigo?: string | number;
  tipoEvento: TicketEventType;
  [key: string]: any;
}

export type TicketNotificationPayload = TicketCreatedPayload | TicketUpdatedPayload;

export interface TicketChangedDetail {
  sourceEvent: 'ticket:created' | 'ticket:updated';
  tipoEvento?: TicketEventType;
  idTicket?: number;
  idEmpresa?: number;
  codigo?: string | number;
  payload: TicketCreatedPayload | TicketUpdatedPayload;
}

/**
 * Obtiene la URL base del servidor Socket.IO a partir de las variables de entorno de Vite.
 * Prioriza VITE_SOCKET_URL si está definida, o extrae el origen de VITE_API_TICKETS.
 */
export const getSocketBaseUrl = (): string => {

  const apiTickets = import.meta.env.VITE_API_TICKETS;
  try {
    const parsed = new URL(apiTickets.trim());
    return parsed.origin;
  } catch {
    return apiTickets.replace(/\/api-tickets\/?$/, '').trim();
  }
};

/**
 * Crea una nueva instancia de socket Socket.IO configurada con el token de autenticación.
 * autoConnect se deja en false para que el ciclo de vida de React controle explícitamente la conexión.
 */
export const createSocketClient = (token: string): Socket => {
  const url = getSocketBaseUrl();

  return io(url, {
    autoConnect: false,
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
  });
};
