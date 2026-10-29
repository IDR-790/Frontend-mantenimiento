import {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';

import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { AuthContext } from '../auth/context/AuthContext';
import { useFetch } from '../shared/hooks/useFetch';

import { TipoDispositivoTable } from './TipoDispositivoTable';
import type { TipoDispositivo } from './TipoDispositivoTable';

export const TiposDispositivoPage = () => {
    const { tokenSession } = useContext(AuthContext);

    const { getRequest, postRequest, putRequest, deleteRequest } = useFetch();

    const toast = useRef<Toast>(null);

    const TOKEN = tokenSession ?? '';
    const API = import.meta.env.VITE_API_TIPOS_DISPOSITIVO;

    const [tiposDispositivo, setTiposDispositivo] =
        useState<TipoDispositivo[]>([]);

    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    //Pal registro (POST)
    const [dialogVisible, setDialogVisible] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [marca, setMarca] = useState('');

    //Para la edición (PUT)
    const [dialogEditarVisible, setDialogEditarVisible] = useState(false);
    const [tipoEditando, setTipoEditando] = useState<TipoDispositivo | null>(null);
    const [descripcionEdicion, setDescripcionEdicion] = useState('');
    const [marcaEdicion, setMarcaEdicion] = useState('');

    const cargarTiposDispositivo = useCallback(async () => {
        if (!TOKEN) return;

        setCargando(true);

        try {
            const respuesta = await getRequest({
                url: API,
                token: TOKEN
            });

            setTiposDispositivo(respuesta ?? []);
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail:
                    error?.message ??
                    'No se pudieron cargar los tipos de dispositivo.',
                life: 5000
            });
        } finally {
            setCargando(false);
        }
    }, [TOKEN, getRequest]);

    useEffect(() => {
        cargarTiposDispositivo();
    }, [cargarTiposDispositivo]);

    //Limpia el formulario de registro
    const limpiarFormulario = () => {
        setDescripcion('');
        setMarca('');
    };

    //Registra un tipo de dispositivo mediante POST
    const registrarTipoDispositivo = async () => {
        if(!descripcion.trim() && !marca.trim()){
            toast.current?.show({
                severity: 'warn',
                summary: 'Datos requerdos',
                detail: 'Ingresa al menos una descripción o una marca',
                life: 4000
            });
            return;
        }

        if(!TOKEN){
            toast.current?.show({
                severity: 'error',
                summary: 'Sesión no disponible',
                detail: 'No se encontró el token de autenticación',
                life: 4000
            });
            return;
        }

        setGuardando(true);

        try{
            await postRequest({
                url: API,
                token: TOKEN,
                json: {
                    descripcion: descripcion.trim() || null,
                    marca: marca.trim() || null
                }
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Registro exitoso',
                detail: 'El tipo de dispositivo se registró correctamente',
                life: 4000
            });

            setDialogVisible(false);
            limpiarFormulario();

            await cargarTiposDispositivo();
        } catch(error: any){
            toast.current?.show({
                severity: 'error',
                summary: 'Error al registrar',
                detail:
                    error?.message ??
                    'No se pudo registrar el tipo de dispositivo',
                life: 5000
            });
        } finally{
            setGuardando(false);
        }
    };

    const cerrarDialogo = () => {
        setDialogVisible(false);
        limpiarFormulario();
    };

    //Abrir el formulario con los datos del registro seleccionado
    const abrirEdicion = (tipo: TipoDispositivo) => {
        setTipoEditando(tipo);
        setDescripcionEdicion(tipo.descripcion ?? '');
        setMarcaEdicion(tipo.marca ?? '');
        setDialogEditarVisible(true);
    };

    //Cerrar el formulario de edición
    const cerrarDialogoEdicion = () => {
        if(guardando) return;

        setDialogEditarVisible(false);
        setTipoEditando(null);
        setDescripcionEdicion('');
        setMarcaEdicion('');
    };

    //Actualizar un tipo de dispositivo con PUT
    const actualizarTipoDispositivo = async () => {
        if(!tipoEditando) return;

        if(!descripcionEdicion.trim() && !marcaEdicion.trim()){
            toast.current?.show({
                severity: 'warn',
                summary: 'Datos requeridos',
                detail: 'Ingresar al menos una descripción o una marca',
                life: 4000
            });
            return;
        }
        if(!TOKEN){
            toast.current?.show({
                severity: 'error',
                summary: 'Sesión no disponible',
                detail: 'No se encontró el token de autenticación',
                life: 4000
            });
            return;
        }

        setGuardando(true);

        try{
            await putRequest({
                url: `${API}/${tipoEditando.id_dispositivo}`,
                token: TOKEN,
                json: {
                    descripcion: descripcionEdicion.trim() || null,
                    marca: marcaEdicion.trim() || null
                }
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Actualización exitosa',
                detail: 'El tipo de dispositivo se actualizó correctamente',
                life: 4000
            });

            setDialogEditarVisible(false);
            setTipoEditando(null);
            setDescripcionEdicion('');
            setMarcaEdicion('');

            await cargarTiposDispositivo();
        } catch(error: any){
            toast.current?.show({
                severity: 'error',
                summary: 'Error al actualizar',
                detail: 
                    error?.message ?? 'No se pudo actualizar el tipo de dispositivo',
                life: 5000
            });
        } finally{
            setGuardando(false);
        }
    };

    //Mensaje de confirmación para eliminar un tipo de dispositivo
    const solicitarEliminacion = (tipo: TipoDispositivo) => {
        confirmDialog({
            header: 'Confirmar eliminación',
            message: `¿Estás seguro de que deseas eliminar el tipo de disposiitivo "${tipo.descripcion || tipo.marca || tipo.id_dispositivo}"?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            accept: () => eliminarTipoDispositivo(tipo)
        });
    };

    const eliminarTipoDispositivo = async (tipo: TipoDispositivo) => {
        if(!TOKEN){
            toast.current?.show({
                severity: 'error',
                summary: 'Sesión no disponible',
                detail: 'No se encontró el token de autenticación',
                life: 4000
            });
            return;
        }

        setEliminando(true);

        try{
            await deleteRequest({
                url: `${API}/${tipo.id_dispositivo}`,
                token: TOKEN
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Eliminación exitosa',
                detail: 'El tipo de dispositivo s eliminó correctamente',
                life: 4000
            });

            await cargarTiposDispositivo();
        } catch(error: any){
            toast.current?. show({
                severity: 'error',
                summary: 'Error al eliminar',
                detail: 
                error?.message ?? 'No se pudo eliminar el tipo de dispositivo',
                life: 5000
            });
        } finally{
            setEliminando(false)
        }
    };

    return (
        <div className="card p-4">
            <Toast ref={toast} />
            <ConfirmDialog/>

            <div className="flex align-items-center justify-content-between mb-4">
                <h2 className="m-0">Tipos de dispositivo</h2>

                <Button
                    label="Nuevo tipo de dispositivo"
                    icon="pi pi-plus"
                    onClick={() => setDialogVisible(true)}
                />
            </div>

            {cargando && (
                <p>Cargando tipos de dispositivo...</p>
            )}

            <TipoDispositivoTable
                tiposDispositivo={tiposDispositivo}
                onEditar={abrirEdicion}
                onEliminar={solicitarEliminacion}
            />

            {/* Formulario de registro (POST) */}
            <Dialog
                header="Registrar tipo de dispositivo"
                visible={dialogVisible}
                style={{ width: '450px', maxWidth: '95vw' }}
                modal
                onHide={cerrarDialogo}
                closable={!guardando}
                closeOnEscape={!guardando}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            severity="secondary"
                            outlined
                            onClick={cerrarDialogo}
                            disabled={guardando}
                        />

                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            onClick={registrarTipoDispositivo}
                            loading={guardando}
                        />
                    </div>
                }
            >
                <div className="flex flex-column gap-3">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="descripcion">
                            Descripción
                        </label>

                        <InputText
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) =>
                                setDescripcion(e.target.value)
                            }
                            placeholder="Ej. Sensor de temperatura"
                            maxLength={255}
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="marca">
                            Marca
                        </label>

                        <InputText
                            id="marca"
                            value={marca}
                            onChange={(e) =>
                                setMarca(e.target.value)
                            }
                            placeholder="Ej. Siemens"
                            maxLength={255}
                        />
                    </div>

                    <small className="text-color-secondary">
                        Ingresa al menos uno de los dos campos
                    </small>
                </div>
            </Dialog>

            {/* Formulario para edición (PUT) */}
            <Dialog
                header="Editar tipo de dispositivo"
                visible={dialogEditarVisible}
                style={{width: '450px', maxWidth: '95vw'}}
                modal
                onHide={cerrarDialogo}
                closable={!guardando}
                closeOnEscape={!guardando}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            severity="secondary"
                            outlined
                            onClick={cerrarDialogoEdicion}
                            disabled={guardando}
                        />

                        <Button
                            label="Guardar cambios"
                            icon="pi pi-check"
                            onClick={actualizarTipoDispositivo}
                            loading={guardando}
                        />
                    </div>
                }
            >
                <div className="flex flex-column gap-3">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="descrpcionEdicion">
                            Descripción
                        </label>

                        <InputText
                            id="descripcionEdicion"
                            value={descripcionEdicion}
                            onChange={(e) =>
                                setDescripcionEdicion(e.target.value)
                            }
                            placeholder="Ej. Sensor de temperatura"
                            maxLength={255}
                            disabled={guardando}
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="marcaEdicion">
                            Marca
                        </label>

                        <InputText
                            id="marcaEdicion"
                            value={marcaEdicion}
                            onChange={(e) =>
                                setMarcaEdicion(e.target.value)
                            }
                            placeholder="Ej. Siemens"
                            maxLength={255}
                            disabled={guardando}
                        />
                    </div>

                    <small className="text-color-secondary">
                        Modifica los campos que necesites y guarda los cambios
                    </small>
                </div>
            </Dialog>
        </div>
    );
};