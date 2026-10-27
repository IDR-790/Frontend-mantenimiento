import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';

interface Props {
    estado: number;
}

export const TicketStatusBadge = ({ estado }: Props) => {
    switch (estado) {
        case 1:
            return <Tag value="Abierto" severity="danger" />;
        case 2:
            return <Tag value="Espera de Refacción" severity="warning" />;
        case 3:
            return <Tag value="Cerrado" severity="success" />;
        case 4:
            return <Tag value="No Procedente" />;
        case 5:
            return <Tag value="En Atención" severity="info" />;
        default:
            return <Tag value="Desconocido" />;
    }
};
