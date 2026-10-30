import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';

export interface Dispositivo {
    id_disp: number;
    id_empresa: number | null;
    numero_serie: string | null;
    id_tipo_dispositivo: number | null;
    observaciones: string | null;
    nombre: string | null;
    numero_canales: number | null;
    id_origen: number | null;

    empresa?: {
        id_empresa: number;
        nombre_empresa: string;
    } | null;

    tipoDispositivo?: {
        id_dispositivo: number;
        descripcion: string | null;
        marca: string | null;
    } | null;
}

interface Props {
    dispositivos: Dispositivo[];
    onEditar: (dispositivos: Dispositivo) => void;
    onEliminar: (dispositivos: Dispositivo) => void;
    accionesDeshabilitadas?: boolean;
}

export const DispositivoTable = ({
    dispositivos,
    onEditar,
    onEliminar,
    accionesDeshabilitadas = false
}: Props) => {
    return(
        <DataTable
            value={dispositivos}
            dataKey="id_disp"
            showGridlines
            paginator
            rows={10}
            scrollable
            emptyMessage="No se encontraron dispositivos"
            size="small"
        >
            <Column
                header="ID"
                field="id_disp"
                sortable
                style={{minWidth: '80px'}}
            />
            <Column
                header="Nombre"
                field="nombre"
                sortable
                style={{minWidth: '180px'}}
                body={(dispositivo: Dispositivo) =>
                    dispositivo.nombre || 'Sin nombre'
                }
            />
            <Column
                header="Número de serie"
                field="numero_serie"
                sortable
                style={{minWidth: '160px'}}
                body={(dispositivo: Dispositivo) =>
                    dispositivo.numero_serie || 'Sin número de serie'
                }
            />
            <Column
                header="Tipo de dispositivo"
                style={{minWidth: '200px'}}
                body={(dispositivo: Dispositivo) => {
                    const tipo = dispositivo.tipoDispositivo;

                    if(!tipo) return 'Sin tipo asignado'

                    return [tipo.descripcion, tipo.marca]
                        .filter(Boolean)
                        .join(' - ') || 'Sin descripción';
                }}
            />
            <Column
                header="Canales"
                field="numero_canales"
                sortable
                style={{minWidth: '100px'}}
                body={(dispositivo: Dispositivo) =>
                    dispositivo.numero_canales ?? '-'
                }
            />
            <Column
                header="Origen"
                field="id_origen"
                sortable
                style={{minWidth: '90px'}}
                body={(dispositivo: Dispositivo) =>
                    dispositivo.id_origen ?? '-'
                }
            />
            <Column
                header="Empresa"
                style={{minWidth: '180px'}}
                body={(dispositivo: Dispositivo) =>
                    dispositivo.empresa?.nombre_empresa || 'Sin empresa asignada'
                }
            />
            <Column
                header="Observaciones"
                field="observaciones"
                sortable
                style={{minWidth: '220px'}}
                body={(dispositivo: Dispositivo) =>
                    dispositivo.observaciones || 'Sin observaciones'
                }
            />
            <Column
                header="Acciones"
                body={(dispositivo: Dispositivo) => (
                    <div className="flex justify-content-center gap-2">
                        <Button
                            icon="pi pi-pencil"
                            rounded
                            text
                            severity="info"
                            tooltip="Editar dispositivo"
                            tooltipOptions={{
                                position: 'top',
                                showDelay: 100,
                                mouseTrack: true,
                                mouseTrackTop: 25
                            }}
                            disabled={accionesDeshabilitadas}
                            onClick={() => onEditar(dispositivo)}
                        />
                        <Button
                            icon="pi pi-trash"
                            rounded
                            text
                            severity="danger"
                            tooltip="Eliminar dispositivo"
                            tooltipOptions={{
                                position: 'top',
                                showDelay: 100,
                                mouseTrack: true,
                                mouseTrackTop: 25
                            }}
                            disabled={accionesDeshabilitadas}
                            onClick={() => onEliminar(dispositivo)}
                        />
                    </div>
                )}
                style={{width: '110px', textAlign: 'center'}}
            />
        </DataTable>
    );
};