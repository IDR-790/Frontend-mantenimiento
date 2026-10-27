import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { CascadeSelect } from 'primereact/cascadeselect';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';

import { useFetch } from '../shared/hooks/useFetch';

interface AreaAtencion {
    idAreaAtencion: number;
    nombre: string;
}

interface Ticket {
    idTicket: number;
    idEmpresa: number;
    nombreEmpresa: string;
    idAreaAtencion: number;
    idCatFallaElementoEquipoSistema: number;
    eco: number;
    evidencia: string;
    observaciones: string;
    idEstado: number;
    tipo: string; 
    archivo: File | null;

    codigo: string;
    aho: number;
    consecutivo: number;
    AreaAtencion?: AreaAtencion;
}

interface Falla {
    idCatFallaElementoEquipoSistema: number;
    descripcion: string;
    idAreaAtencion: number;
}

interface ElementoSistema {
    idElementoEquipoSistema: number;
    nombre: string;
    fallas: Falla[];
}

interface EquipoSistema {
    idEquipoSistema: number;
    nombre: string;
    elementos: ElementoSistema[];
}

export const TicketsIncidencias = () => {
    let emptyTicket: Ticket = {
        idTicket: 0,
        idEmpresa: 0,
        nombreEmpresa: '',
        idAreaAtencion: 0,
        idCatFallaElementoEquipoSistema: 0,
        eco: 0,
        evidencia: '',
        observaciones: '',
        idEstado: 0,
        tipo: '',
        archivo: null,
        codigo: '',
        aho: 0,
        consecutivo: 0
    };

    const [listaElementosFallas, setListaElementosFallas] = useState<EquipoSistema[]>([]);

    const [ticket, setTicket] = useState<Ticket>(emptyTicket);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [nuevoTicketDialog, setTicketDialog] = useState<boolean>(false);
    const [viewTicketDialog, setViewTicketDialog] = useState<boolean>(false);

    const dt = useRef<DataTable<Ticket[]>>(null);
    const toast = useRef<Toast>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const tipos = [
        { name: 'Interno', code: 'I' },
        { name: 'Externo', code: 'E' },
        { name: 'TI', code: 'T' }
    ];

    const API_URL = "http://192.168.1.70:3000/api-tickets"; 
    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoyNCwibm9tYnJlIjoiVXN1YXJpbyBaT1hPIiwiZW1haWwiOiJ6b3hvQGluc2l0cmEuY29tLm14IiwiaWRFbXByZXNhIjo5LCJub21icmVFbXByZXNhIjoiWk9YTyIsImlhdCI6MTc4MTU1MTYyMCwiZXhwIjoxNzgxNjA1NjIwfQ.Y2N8pQs4txiRXjuBUfSRv0-T4e0dYTfUlfaH4mxg3ZA";
    const { getRequest, postRequest } = useFetch();

    // --------------- Funciones de utilidad ---------------
    const openNuevoTicket = () => {
        setTicket(emptyTicket);
        setSubmitted(false);
        setTicketDialog(true);
    };

    const hideDialog = () => {
        setTicket(emptyTicket);
        setSubmitted(false);
        setTicketDialog(false);
    };

    const onUpload = (event: FileUploadHandlerEvent) => {
        const file = event.files[0];
        if (file && file.type !== 'image/png') {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Solo se permiten archivos PNG.', life: 3000 });
            return;
        }
        setTicket((prev) => ({ ...prev, archivo: file }));
        toast.current?.show({ severity: 'info', summary: 'Éxito', detail: 'Imagen PNG cargada en memoria correctamente.', life: 3000 });
    };

    // --------------- Funciones sobre los cuadros de dialogo ---------------
    const saveTicket = async () => {
        setSubmitted(true);

        const isFormValid = 
            ticket.idEmpresa && ticket.nombreEmpresa?.trim() && ticket.idAreaAtencion && 
            ticket.idCatFallaElementoEquipoSistema && ticket.tipo?.trim() && ticket.observaciones.trim();

        if (isFormValid) {
            try {

                const formData = new FormData();                
                formData.append('idEmpresa', String(ticket.idEmpresa));
                formData.append('nombreEmpresa', ticket.nombreEmpresa);
                formData.append('idAreaAtencion', String(ticket.idAreaAtencion));
                formData.append('idCatFallaElementoEquipoSistema', String(ticket.idCatFallaElementoEquipoSistema));
                formData.append('tipo', ticket.tipo);

                if (ticket.eco) formData.append('eco', String(ticket.eco));
                if (ticket.observaciones) formData.append('observaciones', ticket.observaciones);
                if (ticket.archivo) formData.append('archivo', ticket.archivo); 

                const response = await postRequest({ url: `${API_URL}/tickets`, formData, token: TOKEN }); // Nuevo tipo de petición POST para crear el ticket con formData
                if (response) {
                    toast.current?.show({ severity: 'success', summary: 'Éxito', life: 3000, detail: 'Ticket registrado correctamente.' });
                } else {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error en el servidor.', life: 5000 });
                }

                setTicketDialog(false);
                setSubmitted(false);
                loadAllData();
                setTicket(emptyTicket);

            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo conectar con el servidor', life: 3000 });
            }
        }
    };

    const viewTicket = (ticket: Ticket) => {
        setTicket({ ...ticket });
        setViewTicketDialog(true);
    };

    // --------------- Funciones para cargar datos desde el Back ---------------
    const loadAllData = useCallback(async () => {
        try {

            const [resTickets, resFallas] = await Promise.all([
                getRequest({ url: `${API_URL}/tickets`, token: TOKEN }),
                getRequest({ url: `${API_URL}/falla-equipo-sistema`, token: TOKEN }),
            ]);

            if (resTickets) {
                setTickets(resTickets.get);
                
            }

            if (resFallas) {
                setListaElementosFallas(resFallas); 
            }

        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos de los Tickets.', life: 5000 });
        }
    }, [getRequest]);
    useEffect(() => { loadAllData(); }, []);

    const equiposTemplate = (rowData: Ticket) => {
        const empresaEncontrada = listaElementosFallas.find(e => e.idEquipoSistema === rowData.idCatFallaElementoEquipoSistema);
        return <span>{empresaEncontrada ? empresaEncontrada.nombre : `ID: ${rowData.idCatFallaElementoEquipoSistema}`}</span>;
    };

    const fallaTemplate = (rowData: any) => {
        let fallaEncontrada: any = null;
        for (const sistema of listaElementosFallas) {
            for (const elemento of sistema.elementos || []) {
                const target = (elemento.fallas || []).find(
                    f => f.idCatFallaElementoEquipoSistema === rowData.idCatFallaElementoEquipoSistema
                );
                if (target) {
                    fallaEncontrada = target;
                    break;
                }
            }
            if (fallaEncontrada) break;
        }
        return (
            <span>{fallaEncontrada ? fallaEncontrada.descripcion : `ID Falla: ${rowData.idCatFallaElementoEquipoSistema}`}</span>
        );
    };

    const fechaTemplate = (rowData: any) => {
        if (!rowData.createdAt) return <span>N/A</span>;        
        const fechaSolo = rowData.createdAt.split('T')[0]; 
        return <span>{fechaSolo}</span>;
    };

    // --------------- Templates ---------------
    const leftToolbarTemplate = () => (
        <div className="flex flex-wrap gap-2">
            <Button label="Crear Ticket" icon="pi pi-plus" severity="success" onClick={openNuevoTicket} />
        </div>
    );

    const actionBodyTemplate = (rowData: Ticket) => (
        <React.Fragment>
            <Button icon="pi pi-info-circle" rounded outlined className="mr-2" severity="warning" onClick={() => viewTicket(rowData)} />
        </React.Fragment>
    );

    const areaBodyTemplate = (rowData: Ticket) => {
        return rowData.AreaAtencion?.nombre;
    };

    const fallasOptionTemplate = (option: any) => {
        return (
            <div className="flex align-items-center gap-2 py-1">
                {option.idEquipoSistema && <i className="pi pi-wrench"/>}
                {option.idElementoEquipoSistema && <i className="pi pi-cog"/>}
                {option.idCatFallaElementoEquipoSistema && <i className="pi pi-ticket"/>}
                <span>{option.nombre || option.descripcion}</span>
            </div>
        );
    };

    const renderCamposTicket = () => {
        return (
            <>
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="idEmpresa" className="font-bold">* ID Empresa</label>
                        <InputNumber id="idEmpresa" value={ticket.idEmpresa || null} onValueChange={(e) => setTicket({ ...ticket, idEmpresa: e.value || 0 })} 
                            useGrouping={false}  className={classNames({ 'p-invalid': submitted && !ticket.idEmpresa })} />
                        {submitted && !ticket.idEmpresa && <small className="p-error">Este dato es obligatorio.</small>}
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="nombreEmpresa" className="font-bold">* Nombre de la Empresa</label>
                        <InputText id="nombreEmpresa" value={ticket.nombreEmpresa} onChange={(e) => setTicket({ ...ticket, nombreEmpresa: e.target.value })} 
                            className={classNames({ 'p-invalid': submitted && !ticket.nombreEmpresa?.trim() })} />
                        {submitted && !ticket.nombreEmpresa?.trim() && <small className="p-error">Este dato es obligatorio.</small>}
                    </div>
                </div>

                <div className="formgrid grid">                    
                    <div className="field col-12 md:col-6">
                        <label htmlFor="idCatFallaElementoEquipoSistema" className="font-bold">* Falla de Elemento / Sistema</label>
                        <CascadeSelect id="idCatFallaElementoEquipoSistema" breakpoint="2000px" dataKey="idCatFallaElementoEquipoSistema" itemTemplate={fallasOptionTemplate}
                            value={ticket.idCatFallaElementoEquipoSistema ? { 
                                idCatFallaElementoEquipoSistema: ticket.idCatFallaElementoEquipoSistema, 
                                descripcion: ticket.observaciones 
                            } : null} 
                            options={listaElementosFallas} optionGroupChildren={['elementos', 'fallas']} optionGroupLabel="nombre" optionLabel="descripcion" 
                            onChange={(e) => {
                                setTicket({...ticket, idCatFallaElementoEquipoSistema: e.value.idCatFallaElementoEquipoSistema, 
                                    idAreaAtencion: e.value.idAreaAtencion, observaciones: e.value.descripcion 
                                });
                            }} 
                            className={classNames('w-full', { 'p-invalid': submitted && !ticket.idCatFallaElementoEquipoSistema })}
                        />
                        {submitted && !ticket.idCatFallaElementoEquipoSistema && (<small className="p-error">Este dato es obligatorio.</small>)}
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="observaciones" className="font-bold">* Observaciones</label>
                        <InputText id="observaciones" value={ticket.observaciones} onChange={(e) => setTicket({ ...ticket, observaciones: e.target.value })} 
                            className={classNames({ 'p-invalid': submitted && !ticket.observaciones?.trim() })} />
                        {submitted && !ticket.observaciones?.trim() && (<small className="p-error">Este dato es obligatorio.</small>)}
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="tipo" className="font-bold">* Tipo</label>
                        <Dropdown id="tipo" value={ticket.tipo} options={tipos} onChange={(e) => setTicket({ ...ticket, tipo: e.value })} optionLabel="name" 
                            className={classNames({ 'p-invalid': submitted && !ticket.tipo })} optionValue="code"/>
                        
                        {submitted && !ticket.tipo?.trim() && <small className="p-error">Este dato es obligatorio.</small>}
                    </div>
                    <div className="field col-12 md:col-6">
                        <label htmlFor="eco" className="font-bold">Económico (Opcional)</label>
                        <InputNumber id="eco" value={ticket.eco || null} onValueChange={(e) => setTicket({ ...ticket, eco: e.value || 0 })} useGrouping={false} />
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col-12">
                        <label className="font-bold">Evidencia (PNG - Opcional)</label>
                        <FileUpload name="archivo" mode="advanced" accept="image/png" maxFileSize={5000000} customUpload uploadHandler={onUpload} auto chooseLabel="Seleccionar PNG"/>
                        {ticket.archivo && (
                            <div className="mt-2 text-green-600 font-semibold flex align-items-center gap-2">
                                <i className="pi pi-check-circle"></i>
                                Archivo listo: {ticket.archivo.name}
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    };

    const renderVistaDetalles = () => {
        return (
            <>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <p><b>Número Ticket (ID):</b> {ticket.idTicket}</p>
                        <p><b>Código:</b> <span className="font-bold text-blue-600">{ticket.codigo}</span></p>
                        <p><b>Empresa (ID):</b> {ticket.idEmpresa}</p>
                        <p><b>Área de atención:</b> {ticket.AreaAtencion?.nombre || `ID: ${ticket.idAreaAtencion}`}</p>
                    </div>
                    <div className="col-12 md:col-6">
                        <p><b>Número económico (Eco):</b> {ticket.eco !== null ? ticket.eco : 'N/A'}</p>
                        <p><b>Año / Consecutivo:</b> {ticket.aho} - ({ticket.consecutivo})</p>
                        <p><b>Observaciones:</b> {ticket.observaciones}</p>
                        <p><b>Evidencia:</b> {ticket.evidencia || 'Sin archivo asignado'}</p>
                    </div>
                </div>
            </>
        );
    };

    const ticketFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined severity="danger" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" severity="success" onClick={saveTicket} />
        </>
    );

    return (
        <div className="card p-4">
            <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate} />

            { /*Tabla inicial con los tickets registrados */ }
            <DataTable ref={dt} value={tickets} dataKey="idTicket" showGridlines paginator rows={7} scrollable scrollHeight="650px" emptyMessage="No se encontraron tickets."
                sortField="idTicket" sortOrder={-1}>
                <Column header="ID Ticket" field="idTicket" style={{ width: '100px' }} />
                <Column header="Código" field="codigo" className="font-semibold" />
                <Column header="Empresa" field="idEmpresa" />
                <Column header="Equipo" body={equiposTemplate} />
                <Column header="Falla" body={fallaTemplate} />
                <Column header="Área de atención" body={areaBodyTemplate} />
                <Column header="Fecha de creación" body={fechaTemplate} />
                <Column header="Económico" body={(row) => row.eco !== null ? row.eco : 'N/A'} />
                <Column header="Opciones" body={actionBodyTemplate} exportable={false} style={{ width: '100px', textAlign: 'center' }} />
            </DataTable>

            {/* Diálogo para Crear una Nuevo Ticket */}
            <Dialog visible={nuevoTicketDialog} style={{ width: '720px' }} header="Detalles del Ticket" modal className="p-fluid" footer={ticketFooter} onHide={hideDialog}>
                {renderCamposTicket()}
            </Dialog>

            {/* Vista de detalles completos del Ticket */}
            <Dialog visible={viewTicketDialog} style={{ width: '720px' }} header="Información Completa del Ticket" modal className="p-fluid" onHide={() => setViewTicketDialog(false)}
                footer={<Button label="Cerrar" icon="pi pi-times" onClick={() => setViewTicketDialog(false)} />} >
                {renderVistaDetalles()}
            </Dialog>
        </div>
    );
};