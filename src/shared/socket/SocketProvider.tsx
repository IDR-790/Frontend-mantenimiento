import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

import { AuthContext } from '../../auth/context/AuthContext';
import { GeneralContext } from '../GeneralContext';
import { SocketContext } from './SocketContext';
import {
  createSocketClient,
  TicketChangedDetail,
  TicketCreatedPayload,
  TicketInboxNotification,
  TicketNotificationPayload,
  TicketUpdatedPayload,
} from './socketService';

interface Props {
  children: ReactNode;
}

/**
 * Determina si la vista actualmente activa en pantalla corresponde al flujo de tickets.
 * Consulta la presencia de los contenedores de las vistas mediante el atributo data-view en el DOM.
 */
export const isTicketsOrTecnicosActive = (): boolean => {
  if (typeof document !== 'undefined') {
    return Boolean(
      document.querySelector(
        '[data-view="tickets"], [data-view="tecnicos"], [data-view="dashboard"]'
      )
    );
  }
  return false;
};

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const { logged, tokenSession, logout, setTokenExp } = useContext(AuthContext);
  const { empresas } = useContext(GeneralContext);
  const queryClient = useQueryClient();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastTicketNotification, setLastTicketNotification] =
    useState<TicketNotificationPayload | null>(null);
  const [notifications, setNotifications] = useState<TicketInboxNotification[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const notificationIdRef = useRef(0);
  const empresasRef = useRef(empresas);
  empresasRef.current = empresas;

  const token = tokenSession?.token ?? '';
  const idEmpresa = tokenSession?.idEmpresa;

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  }, []);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    // 1. Conectar solo si la sesión está autenticada y tiene un token válido
    if (!logged || !token) {
      disconnect();
      setNotifications([]);
      return;
    }

    // Evitar conexiones duplicadas si ya existe una instancia activa conectada
    if (socketRef.current) {
      return;
    }

    // 2. Crear instancia con el token en el campo auth
    const client = createSocketClient(token);
    socketRef.current = client;
    setSocket(client);

    // 3. Manejadores de conexión
    client.on('connect', () => {
      setIsConnected(true);
      console.info('[Socket] Conectado exitosamente con ID:', client.id);
    });

    client.on('disconnect', (reason) => {
      setIsConnected(false);
      console.warn('[Socket] Desconectado:', reason);
    });

    // 4. Manejo de errores de conexión y expiración de token
    client.on('connect_error', (error: any) => {
      console.warn('[Socket] Error de conexión:', error?.message || error);

      const errorMessage = (error?.message || '').toLowerCase();
      const isAuthError =
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('jwt') ||
        errorMessage.includes('token') ||
        errorMessage.includes('forbidden') ||
        error?.data?.status === 401;

      if (isAuthError) {
        console.error('[Socket] Sesión inválida o expirada en el socket.');
        disconnect();
        if (typeof setTokenExp === 'function') {
          setTokenExp(true);
        }
        if (typeof logout === 'function') {
          logout();
        }
      }
      // Los errores no bloquean la funcionalidad REST del cliente
    });

    // 5. Manejador para creación de tickets: ticket:created
    const handleTicketCreated = (payload: TicketCreatedPayload) => {
      console.info('[Socket] Evento recibido ticket:created:', payload);

      setLastTicketNotification(payload);

      // Invalidar consultas de tickets en React Query (la API REST sigue siendo la fuente de verdad)
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['fichas'] });

      const ticketCodigo = payload.codigo ;
      const shouldNotify = Number(idEmpresa) === 1 && isTicketsOrTecnicosActive();

      if (shouldNotify) {
        notificationIdRef.current += 1;
        // const empresaId = Number(payload.idEmpresa);
        setNotifications((current) => [
          {
            id: notificationIdRef.current,
            codigo: String(ticketCodigo || 'Sin código'),
            evento: 'ticket:created',
            receivedAt: new Date(),
          },
          ...current,
        ]);
      }

      // Despachar evento interno común para que cualquier vista activa recargue sus datos desde REST
      // (La recarga de tablas es para todos los usuarios)
      window.dispatchEvent(
        new CustomEvent<TicketChangedDetail>('ticket:changed', {
          detail: {
            sourceEvent: 'ticket:created',
            idTicket: payload.idTicket,
            idEmpresa: payload.idEmpresa,
            codigo: ticketCodigo,
            payload,
          },
        })
      );

      // Mantener compatibilidad hacia atrás para listeners locales de ticket:created
      window.dispatchEvent(
        new CustomEvent('ticket:created', { detail: payload })
      );
    };

    // 6. Manejador para actualizaciones de tickets: ticket:updated
    // (liberación, inicio de atención, espera de refacción y cierre)
    const handleTicketUpdated = (payload: TicketUpdatedPayload) => {
      console.info('[Socket] Evento recibido ticket:updated:', payload);

      setLastTicketNotification(payload);

      // Invalidar consultas en React Query
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['fichas'] });

      const ticketCodigo = payload.codigo ?? payload.idTicket ?? '';
      const tipoEvento = payload.tipoEvento
      const notificationEvent =
        tipoEvento === 'espera_refaccion' || tipoEvento === 'ticket_cerrado'
          ? tipoEvento
          : null;
      const shouldNotify =
        isTicketsOrTecnicosActive() &&
        notificationEvent !== null;

      if (shouldNotify && notificationEvent) {
        notificationIdRef.current += 1;
        // const empresaId = Number(payload.idEmpresa);
        setNotifications((current) => [
          {
            id: notificationIdRef.current,
            codigo: String(ticketCodigo || 'Sin código'),
            evento: notificationEvent,
            receivedAt: new Date(),
          },
          ...current,
        ]);
      }

      // Despachar evento interno común ante cualquiera de los eventos de actualización
      // (La recarga de tablas es para todos los usuarios)
      window.dispatchEvent(
        new CustomEvent<TicketChangedDetail>('ticket:changed', {
          detail: {
            sourceEvent: 'ticket:updated',
            tipoEvento: payload.tipoEvento,
            idTicket: payload.idTicket,
            idEmpresa: payload.idEmpresa,
            codigo: ticketCodigo,
            payload,
          },
        })
      );
    };

    client.on('ticket:created', handleTicketCreated);
    client.on('ticket:updated', handleTicketUpdated);

    // Conectar explícitamente
    client.connect();

    // 7. Limpieza al desmontar o al cerrar sesión (evita listeners duplicados)
    return () => {
      client.off('ticket:created', handleTicketCreated);
      client.off('ticket:updated', handleTicketUpdated);
      client.removeAllListeners();
      client.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    };
  }, [logged, token, idEmpresa, queryClient, logout, setTokenExp, disconnect]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        lastTicketNotification,
        notifications,
        clearNotifications,
        disconnect,
        reconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
