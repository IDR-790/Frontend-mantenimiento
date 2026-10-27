import React from 'react';

export const ConsultaEmptyState: React.FC = () => {
    return (
        <div
            className="flex flex-column align-items-center justify-content-center p-6 text-center surface-card border-round shadow-1"
            style={{ minHeight: '300px' }}
        >
            <i className="pi pi-search text-6xl text-400 mb-3"></i>
            <span className="text-xl font-semibold text-700 mb-1">Consulta de Tickets</span>
            <span className="text-500 max-w-20rem">
                Seleccione los filtros deseados y presione el botón de buscar para visualizar la información de los tickets.
            </span>
        </div>
    );
};
