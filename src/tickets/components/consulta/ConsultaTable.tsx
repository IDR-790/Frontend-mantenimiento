import React, { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Ticket, EquipoSistema, EmpresaOption } from '../../types/ticket.types';
import { TicketStatusBadge } from '../TicketStatusBadge';
import {
    buscarEquipoNombre,
    buscarFallaDescripcion,
    formatearFechaConsulta,
    obtenerAreaAtencionTexto,
    buscarEmpresaNombre
} from '../../utils/consulta.utils';

interface ConsultaTableProps {
    tickets: Ticket[];
    cargando: boolean;
    listaElementosFallas: EquipoSistema[];
    empresas: EmpresaOption[];
}

export const ConsultaTable: React.FC<ConsultaTableProps> = ({
    tickets,
    cargando,
    listaElementosFallas,
    empresas = []
}) => {
    const dt = useRef<DataTable<Ticket[]>>(null);

    const estadoTemplate = (rowData: Ticket) => {
        return <TicketStatusBadge estado={rowData.idEstado} />;
    };

    const fechaTemplate = (rowData: Ticket) => {
        return <span>{formatearFechaConsulta(rowData.createdAt)}</span>;
    };

    const empresaTemplate = (rowData: Ticket) => {
        return <span>{buscarEmpresaNombre(rowData.idEmpresa, empresas)}</span>;
    };

    const equiposTemplate = (rowData: Ticket) => {
        return <span>{buscarEquipoNombre(rowData, listaElementosFallas)}</span>;
    };

    const fallaTemplate = (rowData: Ticket) => {
        return <span>{buscarFallaDescripcion(rowData, listaElementosFallas)}</span>;
    };

    const areaBodyTemplate = (rowData: Ticket) => {
        return obtenerAreaAtencionTexto(rowData);
    };

    return (
        <DataTable
            ref={dt}
            value={tickets}
            loading={cargando}
            dataKey="idTicket"
            showGridlines
            paginator
            rows={10}
            scrollable
            scrollHeight="600px"
            emptyMessage="No se encontraron tickets con los filtros aplicados."
            sortField="idTicket"
            sortOrder={-1}
        >
            <Column header="ID Ticket" field="idTicket" style={{ width: '100px' }} />
            <Column header="Folio" field="codigo" className="font-semibold" />
            <Column header="Empresa" body={empresaTemplate} />
            <Column header="Equipo" body={equiposTemplate} />
            <Column header="Falla" body={fallaTemplate} />
            <Column header="Área" body={areaBodyTemplate} style={{ width: '120px' }} />
            <Column header="Fecha de creación" body={fechaTemplate} sortField="createdAt" />
            <Column
                header="Eco"
                body={(row: Ticket) => (row.eco !== null ? row.eco : 'N/A')}
                style={{ width: '80px' }}
            />
            <Column header="Estado" body={estadoTemplate} sortField="idEstado" />
        </DataTable>
    );
};
