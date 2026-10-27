import { useState } from 'react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { useSocket } from '../socket/SocketContext';
import { Tag } from 'primereact/tag';

const notificationDetails = {
    'ticket:created': {
        label: 'Abierto',
        color: '#fef2f2',
        background:'#dc2626',
    },
    espera_refaccion: {
        label: 'Espera de refacción',
        color: '#fefce8',
        background: 'orange'
    },
    ticket_cerrado: {
        label: 'Cerrado',
        color:'#f0fdf4' ,
        background: '#16a34a',
    }
};

export default function Notificador(): JSX.Element {
    const [visibleRight, setVisibleRight] = useState(false);
    const { notifications, clearNotifications } = useSocket();

    return (
        <div className="flex align-items-center">
            <Button
                icon="pi pi-bell"
                text
                aria-label="Abrir notificaciones"
                onClick={() => setVisibleRight(true)}
            />
            {notifications.length > 0 && (
                <Badge value={notifications.length} severity="danger" />
            )}
            <Sidebar
                visible={visibleRight}
                onHide={() => setVisibleRight(false)}
                position="right"
                header="Notificaciones"
                className="w-full md:w-30rem"
            >
                <div className="flex justify-content-end mb-3">
                    <Button
                        label="Limpiar"
                        icon="pi pi-trash"
                        text
                        size="small"
                        disabled={notifications.length === 0}
                        onClick={clearNotifications}
                    />
                </div>
                {notifications.length === 0 ? (
                    <p className="text-center text-color-secondary">
                        No hay notificaciones.
                    </p>
                ) : (
                    <div className="flex flex-column gap-3">
                        {notifications.map((notification) => {
                            const details = notificationDetails[notification.evento];

                            return (
                                <article
                                    key={notification.id}
                                    className="border-round p-3 shadow-1"
                                    style={{ borderLeft: '5px solid blue' }}
                                >
                                    <div className="mt-2">
                                        <div>
                                            <strong>Ticket:</strong> {notification.codigo}
                                        </div>
                                        <strong>Estado: </strong>
                                        <Tag
                                            value={details.label}
                                            style={{
                                                color: details.color,
                                                backgroundColor: details.background
                                            }}
                                        />
                                        <div>
                                        <span >
                                            {new Intl.DateTimeFormat('es-MX', {
                                                dateStyle: 'short',
                                                timeStyle: 'short'
                                            }).format(notification.receivedAt)}
                                        </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </Sidebar>
        </div>
    );
}