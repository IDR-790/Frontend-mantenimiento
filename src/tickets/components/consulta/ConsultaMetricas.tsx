import React from 'react';
import { MetricasConsulta } from '../../types/consulta.types';

interface ConsultaMetricasProps {
    metricas: MetricasConsulta;
}

export const ConsultaMetricas: React.FC<ConsultaMetricasProps> = ({ metricas }) => {
    return (
        <div className="grid mb-4 align-items-stretch">
            {/* Total de tickets */}
            <div className="col-12 sm:col-6 md:col-3 flex">
                <div
                    className="surface-card shadow-1 border-round p-3 w-full flex align-items-center justify-content-between"
                    style={{ height: '85px' }}
                >
                    <div className="flex flex-column justify-content-center">
                        <span className="block text-500 font-medium mb-1">Total Tickets</span>
                        <div className="text-900 font-bold text-2xl line-height-2">
                            {metricas.total}
                        </div>
                    </div>
                    <div
                        className="flex align-items-center justify-content-center bg-gray-100 border-round flex-shrink-0"
                        style={{ width: '2.5rem', height: '2.5rem' }}
                    >
                        <i className="pi pi-ticket text-xl text-gray-600"></i>
                    </div>
                </div>
            </div>
            {/* Tickets abiertos */}
            <div className="col-12 sm:col-6 md:col-3 flex">
                <div
                    className="surface-card shadow-1 border-round p-3 w-full flex align-items-center justify-content-between"
                    style={{ height: '85px' }}
                >
                    <div className="flex flex-column justify-content-center">
                        <span className="block text-500 font-medium mb-1">Tickets Abiertos</span>
                        <div className="font-bold text-2xl text-red-600 line-height-2">
                            {metricas.abiertos}
                        </div>
                    </div>
                    <div
                        className="flex align-items-center justify-content-center bg-red-100 border-round flex-shrink-0"
                        style={{ width: '2.5rem', height: '2.5rem' }}
                    >
                        <i className="pi pi-folder-open text-red-500 text-xl"></i>
                    </div>
                </div>
            </div>
            {/* En espera de refacción */}
            <div className="col-12 sm:col-6 md:col-3 flex">
                <div
                    className="surface-card shadow-1 border-round p-3 w-full flex align-items-center justify-content-between"
                    style={{ height: '85px' }}
                >
                    <div className="flex flex-column justify-content-center">
                        <span className="block text-500 font-medium mb-1">En espera de refacción</span>
                        <div className="font-bold text-2xl text-yellow-600 line-height-2">
                            {metricas.enRefaccion}
                        </div>
                    </div>
                    <div
                        className="flex align-items-center justify-content-center bg-yellow-100 border-round flex-shrink-0"
                        style={{ width: '2.5rem', height: '2.5rem' }}
                    >
                        <i className="pi pi-clock text-yellow-500 text-xl"></i>
                    </div>
                </div>
            </div>
            {/* Tickets cerrados */}
            <div className="col-12 sm:col-6 md:col-3 flex">
                <div
                    className="surface-card shadow-1 border-round p-3 w-full flex align-items-center justify-content-between"
                    style={{ height: '85px' }}
                >
                    <div className="flex flex-column justify-content-center">
                        <span className="block text-500 font-medium mb-1">Tickets Cerrados</span>
                        <div className="font-bold text-2xl text-green-600 line-height-2">
                            {metricas.cerrados}
                        </div>
                    </div>
                    <div
                        className="flex align-items-center justify-content-center bg-green-100 border-round flex-shrink-0"
                        style={{ width: '2.5rem', height: '2.5rem' }}
                    >
                        <i className="pi pi-lock text-green-500 text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};
