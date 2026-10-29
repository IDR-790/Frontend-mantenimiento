import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';

export interface TipoDispositivo {
    id_dispositivo: number;
    descripcion: string | null;
    marca: string | null;
}

interface Props {
    tiposDispositivo: TipoDispositivo[];
    onEditar: (tipo: TipoDispositivo) => void;
    onEliminar: (tipo: TipoDispositivo) => void;
}

export const TipoDispositivoTable = ({
    tiposDispositivo,
    onEditar,
    onEliminar
}: Props) => {
    return (
        <DataTable
            value={tiposDispositivo}
            dataKey="id_dispositivo"
            showGridlines
            paginator
            rows={10}
            scrollable
            emptyMessage="No se encontraron tipos de dispositivo."
            size="small"
        >
            <Column
                header="ID"
                field="id_dispositivo"
                sortable
            />

            <Column
                header="Descripción"
                field="descripcion"
                sortable
            />

            <Column
                header="Marca"
                field="marca"
                sortable
            />

            <Column
                header="Acciones"
                body={(tipo: TipoDispositivo) => (
                    <div className="flex justify-content-center gap-2">
                        <Button
                            icon="pi pi-pencil"
                            rounded
                            text
                            severity="info"
                            tooltip="Editar tipo de dispositivo"
                            tooltipOptions={{
                                position: 'top',
                                showDelay: 100,
                                mouseTrack: true,
                                mouseTrackTop: 25
                            }}
                            onClick={() => onEditar(tipo)}
                        />

                        <Button
                            icon="pi pi-trash"
                            rounded
                            text
                            severity="danger"
                            tooltip="Eliminar tipo de dispositivo"
                            tooltipOptions={{
                                position: 'top',
                                showDelay: 100,
                                mouseTrack: true,
                                mouseTrackTop: 15
                            }}
                            onClick={() => onEliminar(tipo)}
                        />
                    </div>
                )}
                style={{ width: '100px', textAlign: 'center'}}
            />
        </DataTable>
    );
};
