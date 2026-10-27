import { useRef } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

import { Ticket } from '../types/ticket.types';
import { TicketStatusBadge } from './TicketStatusBadge';

interface Props {
    tickets: Ticket[];
    onViewTicket: (ticket: Ticket) => void;
    onViewTicket2: (ticket: Ticket) => void;
}

export const TicketTable = ({
    tickets,
    onViewTicket,
    onViewTicket2
}: Props) => {
    const dt = useRef<DataTable<Ticket[]>>(null);

    const actionBodyTemplate = (rowData: Ticket) => (

        <div className="flex justify-content-center gap-2">
            <Button
                icon="pi pi-folder-open"
                rounded
                outlined
                severity="info"
                onClick={() => onViewTicket(rowData)}
            />
            {/* <Button
                icon="pi pi-eye"
                rounded
                outlined
                severity="success"
                onClick={() => onViewTicket2(rowData)}
                hidden={true}
            /> */}
        </div>
    );

    const estadoTemplate = (rowData: Ticket) => (
        <TicketStatusBadge estado={rowData.idEstado} />
    );

    return (
        <DataTable
            ref={dt}
            value={tickets}
            dataKey="idTicket"
            showGridlines
            paginator
            rows={10}
            scrollable
            emptyMessage="No se encontraron tickets."
            size="small"
            sortField="idTicket"
            sortOrder={-1}
        >
            <Column header="ID" field="idTicket" />
            <Column header="Empresa" field="nombreEmpresa" />
            <Column header="Folio" field="codigo" className="font-semibold" />
            <Column header="Económico" field="eco" />
            <Column header="Equipo - Falla" field="falla" />
            <Column header="Área de atención" field="AreaAtencion" />
            <Column header="Fecha Creación" field="createdAt" />
            <Column header="Estado" body={estadoTemplate} />
            <Column
                header="Detalle"
                body={actionBodyTemplate}
                exportable={false}
                style={{ width: '70px', textAlign: 'center' }}
            />
        </DataTable>
    );
};
