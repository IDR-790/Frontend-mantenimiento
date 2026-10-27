import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';
import {
  TicketInboxNotification,
  TicketNotificationPayload,
} from './socketService';

export interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  lastTicketNotification: TicketNotificationPayload | null;
  notifications: TicketInboxNotification[];
  clearNotifications: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  lastTicketNotification: null,
  notifications: [],
  clearNotifications: () => {},
  disconnect: () => {},
  reconnect: () => {},
});

export const useSocket = (): SocketContextValue => {
  return useContext(SocketContext);
};
