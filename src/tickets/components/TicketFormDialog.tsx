import { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { CascadeSelect } from 'primereact/cascadeselect';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import {
    EmpresaOption,
    EquipoSistema,
    Ticket
} from '../types/ticket.types';
import { OptionsEco } from '../types/consulta.types';
import { GeneralContext } from '../../shared/GeneralContext';
import { AuthContext } from '../../auth/context/AuthContext';
import { useFetch } from '../../shared/hooks/useFetch';
import { fetchOptionsEco } from './consulta/service';

interface Props {
    visible: boolean;
    ticket: Ticket;
    submitted: boolean;

    selectedEmpresa: EmpresaOption | null;
    empresaOptions: EmpresaOption[];
    listaElementosFallas: EquipoSistema[];

    onHide: () => void;
    onSave: () => void;

    onTicketChange: (ticket: Ticket) => void;
    onEmpresaChange: (empresa: EmpresaOption | null) => void;
    onUpload: (event: FileUploadHandlerEvent) => void;
}

export const TicketFormDialog = ({
    visible,
    ticket,
    submitted,
    selectedEmpresa,
    empresaOptions,
    listaElementosFallas,
    onHide,
    onSave,
    onTicketChange,
    onEmpresaChange,
    onUpload
}: Props) => {
    const { empresas } = useContext(GeneralContext);
    const { tokenSession } = useContext(AuthContext);
    const TOKEN = tokenSession?.token ?? '';
    const { getRequest } = useFetch();

    const [listaEcos, setListaEcos] = useState<OptionsEco[]>([]);
    const [loadingEcos, setLoadingEcos] = useState<boolean>(false);

    useEffect(() => {
        const cargarEcos = async () => {
            if (!visible || !TOKEN) return;
            try {
                setLoadingEcos(true);
                const data = await fetchOptionsEco(TOKEN, getRequest);
                setListaEcos(data);
            } catch (error) {
                console.error('Error al cargar opciones de eco en TicketFormDialog:', error);
            } finally {
                setLoadingEcos(false);
            }
        };

        cargarEcos();
    }, [visible, TOKEN, getRequest]);

    const ecosFiltrados = useMemo(() => {
        if (selectedEmpresa?.code) {
            return listaEcos.filter((eco) => eco.idEmpresa === selectedEmpresa.code);
        }
        return [];
    }, [listaEcos, selectedEmpresa]);

    const elementoSeleccionado = useMemo(() => {
        if (!ticket.idCatFallaElementoEquipoSistema || !listaElementosFallas) return null;
        for (const equipo of listaElementosFallas) {
            for (const elemento of equipo.elementos ?? []) {
                if (elemento.fallas?.some(f => f.idCatFallaElementoEquipoSistema === ticket.idCatFallaElementoEquipoSistema)) {
                    return elemento;
                }
            }
        }
        return null;
    }, [ticket.idCatFallaElementoEquipoSistema, listaElementosFallas]);

    const requiereEco = Boolean(elementoSeleccionado?.eco);

    const fallasOptionTemplate = (option: any) => (
        <div className="flex align-items-center gap-2 py-1">
            {option.idEquipoSistema && <i className="pi pi-wrench" />}
            {option.idElementoEquipoSistema && <i className="pi pi-cog" />}
            {option.idCatFallaElementoEquipoSistema && <i className="pi pi-ticket" />}
            <span>{option.nombre || option.descripcion}</span>
        </div>
    );

    const archivoItemTemplate = (file: any, props: any) => (
        <div className="flex align-items-center justify-content-between p-3 border-round surface-100 mb-2">
            <div className="flex align-items-center gap-3">
                <i className="pi pi-image text-2xl text-primary" />

                <div className="flex flex-column text-left">
                    <span className="font-semibold text-sm">
                        {file.name}
                    </span>

                    <small className="text-color-secondary">
                        {props.formatSize}
                    </small>
                </div>
            </div>

            <Button
                type="button"
                icon="pi pi-times"
                rounded
                text
                severity="danger"
                onClick={() => {
                    props.onRemove();
                    onTicketChange({
                        ...ticket,
                        archivo: null
                    });
                }}
            />
        </div>
    );

    const footer = (
        <>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                outlined
                severity="danger"
                onClick={onHide}
            />

            <Button
                label="Guardar"
                icon="pi pi-check"
                severity="success"
                onClick={onSave}
            />
        </>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '720px' }}
            header="Nuevo Ticket"
            modal
            className="p-fluid"
            footer={footer}
            onHide={onHide}
        >
            <div className="formgrid grid">
                <div className="field col-12">
                    <label className="font-bold">
                        * Nombre de la Empresa
                    </label>

                    <Dropdown
                        value={selectedEmpresa}
                        onChange={(e) => {
                            onEmpresaChange(e.value);
                            if (ticket.eco) {
                                onTicketChange({
                                    ...ticket,
                                    eco: null
                                });
                            }
                        }}
                        options={empresaOptions}
                        optionLabel="name"
                        placeholder="Selecciona una empresa"
                        className={classNames('w-full', {
                            'p-invalid': submitted && !selectedEmpresa
                        })}
                    />


                    {submitted && !selectedEmpresa && (
                        <small className="p-error">
                            Este dato es obligatorio.
                        </small>
                    )}
                </div>
            </div>

            <div className="formgrid grid">
                <div className="field col-12">
                    <label
                        htmlFor="idCatFallaElementoEquipoSistema"
                        className="font-bold"
                    >
                        * Falla de Elemento / Sistema
                    </label>

                    <CascadeSelect
                        id="idCatFallaElementoEquipoSistema"
                        breakpoint="2000px"
                        dataKey="idCatFallaElementoEquipoSistema"
                        itemTemplate={fallasOptionTemplate}
                        value={
                            ticket.idCatFallaElementoEquipoSistema
                                ? {
                                    idCatFallaElementoEquipoSistema:
                                        ticket.idCatFallaElementoEquipoSistema,
                                    descripcion:
                                        ticket.fallaTexto || 'Falla Seleccionada'
                                }
                                : null
                        }
                        options={listaElementosFallas}
                        optionGroupChildren={['elementos', 'fallas']}
                        optionGroupLabel="nombre"
                        optionLabel="descripcion"
                        onChange={(e) => {
                            if (e.value) {
                                const idFalla = e.value.idCatFallaElementoEquipoSistema;
                                let tieneEco = false;
                                for (const equipo of listaElementosFallas) {
                                    for (const el of equipo.elementos ?? []) {
                                        if (el.fallas?.some(f => f.idCatFallaElementoEquipoSistema === idFalla)) {
                                            tieneEco = Boolean(el.eco);
                                            break;
                                        }
                                    }
                                }
                                onTicketChange({
                                    ...ticket,
                                    idCatFallaElementoEquipoSistema: idFalla,
                                    idAreaAtencion: e.value.idAreaAtencion,
                                    fallaTexto: e.value.descripcion,
                                    eco: tieneEco ? ticket.eco : null
                                });
                                return;
                            }

                            onTicketChange({
                                ...ticket,
                                idCatFallaElementoEquipoSistema: 0,
                                fallaTexto: '',
                                eco: null
                            });
                        }}
                        className={classNames('w-full', {
                            'p-invalid':
                                submitted &&
                                !ticket.idCatFallaElementoEquipoSistema
                        })}
                    />

                    {submitted &&
                        !ticket.idCatFallaElementoEquipoSistema && (
                            <small className="p-error">
                                Este dato es obligatorio.
                            </small>
                        )}
                </div>

                {requiereEco && (
                    <div className="field col-12 md:col-6">
                        <label htmlFor="eco" className="font-bold">
                            * Económico
                        </label>

                        <Dropdown
                            id="eco"
                            value={ticket.eco}
                            options={ecosFiltrados}
                            optionLabel="label"
                            optionValue="label"
                            filter
                            showClear
                            disabled={!selectedEmpresa || loadingEcos}
                            placeholder={
                                loadingEcos
                                    ? 'Cargando económicos...'
                                    : !selectedEmpresa
                                        ? 'Primero selecciona una empresa'
                                        : 'Selecciona un económico'
                            }
                            emptyMessage={
                                !selectedEmpresa
                                    ? 'Primero selecciona una empresa'
                                    : 'No hay económicos disponibles para esta empresa'
                            }
                            emptyFilterMessage="No se encontraron económicos"
                            onChange={(e) =>
                                onTicketChange({
                                    ...ticket,
                                    eco:
                                        e.value !== undefined &&
                                            e.value !== null &&
                                            e.value !== ''
                                            ? e.value
                                            : null
                                })
                            }
                            className={classNames('w-full', {
                                'p-invalid':
                                    submitted &&
                                    (ticket.eco === null ||
                                        ticket.eco === undefined ||
                                        String(ticket.eco).trim() === '')
                            })}
                        />

                        {submitted &&
                            (ticket.eco === null ||
                                ticket.eco === undefined ||
                                String(ticket.eco).trim() === '') && (
                                <small className="p-error">
                                    Este dato es obligatorio.
                                </small>
                            )}
                    </div>
                )}

                <div className="field col-12">
                    <label htmlFor="observaciones" className="font-bold">
                        * Observaciones
                    </label>

                    <InputText
                        id="observaciones"
                        value={ticket.observaciones}
                        onChange={(e) =>
                            onTicketChange({
                                ...ticket,
                                observaciones: e.target.value
                            })
                        }
                        className={classNames({
                            'p-invalid':
                                submitted &&
                                !ticket.observaciones.trim()
                        })}
                    />

                    {submitted && !ticket.observaciones.trim() && (
                        <small className="p-error">
                            Este dato es obligatorio.
                        </small>
                    )}
                </div>
            </div>

            <div className="formgrid grid">
                <div className="field col-12">
                    <label className="font-bold">
                        Evidencia (PNG - Opcional)
                    </label>

                    <FileUpload
                        name="archivo"
                        mode="advanced"
                        accept="image/png"
                        maxFileSize={5000000}
                        customUpload
                        uploadHandler={onUpload}
                        auto
                        chooseLabel="Seleccionar PNG"
                        itemTemplate={archivoItemTemplate}
                        emptyTemplate={
                            <p className="m-0 text-color-secondary text-sm">
                                Carga una imagen PNG de no más de 5MB.
                            </p>
                        }
                    />

                    {ticket.archivo && (
                        <div className="mt-2 text-green-600 font-semibold flex align-items-center gap-2">
                            <i className="pi pi-check-circle" />
                            Archivo listo: {ticket.archivo.name}
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
};
