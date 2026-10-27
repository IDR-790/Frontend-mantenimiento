import React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { OptionsEstado, OptionsEco, OptionItem } from '../../types/consulta.types';

interface ConsultaToolbarProps {
    filtroFechaDesde: Date | null;
    filtroFechaHasta: Date | null;
    filtroEmpresa: number | null;
    filtroTipo: string | null;
    filtroEstado: number | null;
    filtroEco: number | string | null;
    optionsEmpresas: OptionItem<number>[];
    optionsTipos: OptionItem<string>[];
    optionsEstado: OptionsEstado[];
    optionsEco: OptionsEco[];
    cargando: boolean;
    onFechaDesdeChange: (value: Date | null) => void;
    onFechaHastaChange: (value: Date | null) => void;
    onEmpresaChange: (value: number | null) => void;
    onTipoChange: (value: string | null) => void;
    onEstadoChange: (value: number | null) => void;
    onEcoChange: (value: number | string | null) => void;
    onBuscar: () => void;
    onLimpiar: () => void;
}

export const ConsultaToolbar: React.FC<ConsultaToolbarProps> = ({
    filtroFechaDesde,
    filtroFechaHasta,
    filtroEmpresa,
    filtroTipo,
    filtroEstado,
    filtroEco,
    optionsEmpresas,
    optionsTipos,
    optionsEstado,
    optionsEco,
    cargando,
    onFechaDesdeChange,
    onFechaHastaChange,
    onEmpresaChange,
    onTipoChange,
    onEstadoChange,
    onEcoChange,
    onBuscar,
    onLimpiar
}) => {
    const toolbarStartTemplate = () => (
        <div className="flex flex-wrap align-items-end gap-3">
            <div className="flex flex-column gap-1">
                <label className="text-sm font-semibold text-700">Fecha Desde</label>
                <Calendar
                    value={filtroFechaDesde}
                    onChange={(e) => onFechaDesdeChange(e.value as Date | null)}
                    locale="es"
                    dateFormat="dd/mm/yy"
                    showButtonBar
                    showIcon
                    placeholder="dd/mm/aaaa"
                    className="w-12rem"
                />
            </div>
            <div className="flex flex-column gap-1">
                <label className="text-sm font-semibold text-700">Fecha Hasta</label>
                <Calendar
                    value={filtroFechaHasta}
                    onChange={(e) => onFechaHastaChange(e.value as Date | null)}
                    locale="es"
                    dateFormat="dd/mm/yy"
                    showButtonBar
                    showIcon
                    placeholder="dd/mm/aaaa"
                    className="w-12rem"
                />
            </div>
            <div className="flex flex-column gap-1">
                <label className="text-sm font-semibold text-700">Empresa</label>
                <Dropdown
                    value={filtroEmpresa}
                    options={optionsEmpresas}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(e) => onEmpresaChange(e.value ?? null)}
                    placeholder="Todas"
                    showClear
                    className="w-12rem"
                />
            </div>
            <div className="flex flex-column gap-1">
                <label className="text-sm font-semibold text-700">Tipo</label>
                <Dropdown
                    value={filtroTipo}
                    options={optionsTipos}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(e) => onTipoChange(e.value ?? null)}
                    placeholder="Todos"
                    showClear
                    className="w-10rem"
                />
            </div>
            <div className="flex flex-column gap-1">
                <label className="text-sm font-semibold text-700">Estado</label>
                <Dropdown
                    value={filtroEstado}
                    options={optionsEstado}
                    optionLabel="label"
                    optionValue="value"
                    onChange={(e) => onEstadoChange(e.value ?? null)}
                    placeholder="Todos"
                    showClear
                    className="w-10rem"
                />
            </div>
            <div className="flex flex-column gap-1">
                <label className="text-sm font-semibold text-700">Eco</label>
                <Dropdown
                    value={filtroEco}
                    options={optionsEco}
                    optionLabel="label"
                    optionValue="label"
                    onChange={(e) => onEcoChange(e.value ?? null)}
                    placeholder="Todos"
                    showClear
                    filter
                    className="w-10rem"
                />
            </div>
            <Button
                label="Buscar"
                icon="pi pi-search"
                severity="info"
                onClick={onBuscar}
                loading={cargando}
            />
            <Button
                label="Limpiar"
                icon="pi pi-filter-slash"
                severity="secondary"
                outlined
                onClick={onLimpiar}
                disabled={cargando}
            />
        </div>
    );

    return <Toolbar className="mb-4" start={toolbarStartTemplate} />;
};
