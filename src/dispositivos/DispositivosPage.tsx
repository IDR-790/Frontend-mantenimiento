import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import { AuthContext } from "../auth/context/AuthContext";
import { useFetch } from "../shared/hooks/useFetch";

import { DispositivoTable } from "./DispositivoTable";
import type { Dispositivo } from "./DispositivoTable";

interface Empresa {
    id_empresa: number;
    nombre_empresa: string;
}

interface TipoDispositivo {
    id_dispositivo: number;
    descripcion: string | null;
    marca: string | null;
}

interface FormDispositivo {
    id_empresa: number | null;
    numero_serie: string;
    id_tipo_dispositivo: number | null;
    observaciones: string;
    nombre: string;
    numero_canales: number | null;
    id_origen: number | null;
}

const formularioInicial: FormDispositivo = {
    id_empresa: null,
    numero_serie: '',
    id_tipo_dispositivo: null,
    observaciones: '',
    nombre: '',
    numero_canales: null,
    id_origen: null
};

export const DispositivosPage = () => {
    const { tokenSession } = useContext(AuthContext);

    const { getRequest, postRequest, putRequest, deleteRequest } = useFetch();

    const toast = useRef<Toast>(null);

    const TOKEN = tokenSession ?? '';

    const API = import.meta.env.VITE_API_DISPOSITIVOS_MANT;
    const API_EMPRESAS = import.meta.env.VITE_API_EMPRESAS_MANT;
    const API_TIPOS = import.meta.env.VITE_API_TIPOS_DISPOSITIVO;

    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [tiposDispositivo, setTiposDispositivo] = useState<TipoDispositivo[]>([]);

    const [formulario, setFormulario] = useState<FormDispositivo>(formularioInicial);

    const [dialogoVisible, setDialogoVisible] = useState(false);
    const [dialogoEdicionVisible, setDialogoEdicionVisible] = useState(false);

    const [dispositivoEditando, setDispositivoEditando] = useState<Dispositivo | null>(null);

    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    //Consultar dispositivos
    const cargarDispositivos = useCallback(async () => {
        setCargando(true);

        try{
            const respuesta = await getRequest({
                url: API,
                token: TOKEN
            });

            setDispositivos(respuesta ?? []);
        } catch(error: any){
            toast.current?.show({
                severity: 'error',
                summary:'Error',
                detail: error.message || 'No fue posible cargar los dispositivos',
                life: 3000
            });
        } finally {
            setCargando(false);
        }
    }, [API, TOKEN, getRequest]);

    //Consultar empresas y tipos de dispositivo
    const cargarCatalogos = useCallback(async () => {
        try{
            const [respuestaEmpresas, respuestaTipos] = await Promise.all([
                getRequest({
                    url: API_EMPRESAS,
                    token: TOKEN
                }),
                getRequest({
                    url: API_TIPOS,
                    token: TOKEN
                })
            ]);

            setEmpresas(respuestaEmpresas ?? []);
            setTiposDispositivo(respuestaTipos ?? []);
        } catch(error:any){
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'No fue posible cargar los catálogos',
                life: 3000
            });
        }
    }, [API_EMPRESAS, API_TIPOS, TOKEN, getRequest]);

    //Cargar información inicial
    useEffect(() => {
        cargarDispositivos();
        cargarCatalogos();
    }, [cargarDispositivos, cargarCatalogos]);

    //Actualizar campos del formulario
    const actualizarCampo = (
        campo: keyof FormDispositivo,
        valor: string | number | null
    ) => {
        setFormulario(anterior => ({
            ...anterior,
            [campo]: valor
        }));
    };

    //Limpiar formulario
    const limpiarFormulario = () => {
        setFormulario({ ...formularioInicial });
        setDispositivoEditando(null);
    };

    //Abrir registro
    const abrirDialogo = () => {
        limpiarFormulario();
        setDialogoVisible(true);
    };

    //Cerrar registro
    const cerrarDialogo = () => {
        if(guardando) return;

        setDialogoVisible(false);
        limpiarFormulario();
    };

    //Validar campos numéricos
    const validarCamposNumericos = (): boolean => {
        const numeroCanales = formulario.numero_canales;
        const origen = formulario.id_origen;

        if(
            numeroCanales !== null &&
            (!Number.isInteger(numeroCanales) || numeroCanales <= 0)
        ){
            toast.current?.show({
                severity: 'warn',
                summary: 'Dato inválido',
                detail: 'El número de canales debe ser un entero positivo',
                life:3000
            });
            return false;
        }

        if(
            origen !== null &&
            (!Number.isInteger(origen) || origen < 1 || origen > 4)
        ){
            toast.current?.show({
                severity: 'warn',
                summary: 'Dato inválido',
                detail: 'El origen debe ser un valor entre 1 y 4',
                life: 3000
            });
            return false;
        }
        return true;
    };

    //Construir datos para enviar al backend
    const construirDatos = () => ({
        id_empresa: formulario.id_empresa,
        numero_serie: formulario.numero_serie.trim() || null,
        id_tipo_dispositivo: formulario.id_tipo_dispositivo,
        observaciones: formulario.observaciones.trim() || null,
        nombre: formulario.nombre.trim() || null,
        numero_canales: formulario.numero_canales,
        id_origen: formulario.id_origen
    });

    //Registrar dispositivo
    const registrarDispositivo = async () => {
        if(!validarCamposNumericos()) return;

        const datos = construirDatos();

        setGuardando(true);

        try{
            await postRequest({
                url: API,
                token: TOKEN, 
                json: datos
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Correcto',
                detail: 'Dispositivo registrado correctamente',
                life: 3000
            });

            setDialogoVisible(false);
            limpiarFormulario();

            await cargarDispositivos();
        } catch(error: any){
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'No fue posible registrar el dispositivo',
                life: 3000
            });
        } finally {
            setGuardando(false);
        }
    };

    //Abrir edición
    const abrirEdicion = (dispositivo: Dispositivo) => {
        setDispositivoEditando(dispositivo);

        setFormulario({
            id_empresa: dispositivo.id_empresa,
            numero_serie: dispositivo.numero_serie ?? '',
            id_tipo_dispositivo: dispositivo.id_tipo_dispositivo,
            observaciones: dispositivo.observaciones ?? '',
            nombre: dispositivo.nombre ?? '',
            numero_canales: dispositivo.numero_canales,
            id_origen: dispositivo.id_origen
        });

        setDialogoEdicionVisible(true);
    };

    //Cerrar edición
    const cerrarDialogoEdicion = () => {
        if(guardando) return;

        setDialogoEdicionVisible(false);
        setDispositivoEditando(null)
        limpiarFormulario();
    };

    //Actualizar dispositivo
    const actualizarDispositivo = async () => {
        if(!dispositivoEditando) return;

        if(!validarCamposNumericos()) return;

        const datos = construirDatos();

        try{
            await putRequest({
                url: `${API}/${dispositivoEditando.id_disp}`,
                token: TOKEN,
                json: datos
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Correcto',
                detail: 'Dispositivo actualizado correctamente',
                life: 3000
            });

            setDialogoEdicionVisible(false);
            limpiarFormulario();

            await cargarDispositivos();
        } catch(error: any){
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'No fue posible actualizar el dispositivo',
                life: 3000
            });
        } finally{
            setGuardando(false);
        }
    };

    //Confirmar eliminación
    const confirmarEliminacion = (dispositivo: Dispositivo) => {
        confirmDialog({
            message: `¿Estás seguro de eliminar el dispositivo ${dispositivo.nombre || dispositivo.numero_serie || dispositivo.id_disp}`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptClassName: 'p-button-danger',
            accept: () => eliminarDispositivo(dispositivo)
        });
    };

    //Eliminar dispositivo
    const eliminarDispositivo = async (dispositivo: Dispositivo) => {
        setEliminando(true);

        try{
            await deleteRequest({
                url: `${API}/${dispositivo.id_disp}`,
                token: TOKEN
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Correcto',
                detail: 'Dispositivo eliminado correctamente',
                life: 3000
            });

            await cargarDispositivos();
        } catch(error: any){
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'No fue posible eliminar el dispositivo',
                life: 3000
            });
        } finally{
            setEliminando(false);
        }
    };

    //Opciones del desplegable de tipos de dispositivo
    const opcionesTipo = (tipo: TipoDispositivo) => ({
        label: [tipo.descripcion, tipo.marca].filter(Boolean).join(' - ') || 'Sin descripción',
        value: tipo.id_dispositivo
    });

    return(
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="flex justify-content-between align-items-center mb-3">
                <h2>Dispositivos</h2>
                <Button
                    label="Registrar dispositivo"
                    icon="pi pi-plus"
                    onClick={abrirDialogo}
                />
            </div>
            <DispositivoTable
                dispositivos={dispositivos}
                onEditar={abrirEdicion}
                onEliminar={confirmarEliminacion}
                accionesDeshabilitadas={eliminando}
            />

            {/*Diálogo de registro */}
            <Dialog
                header="Registrar dispositivo"
                visible={dialogoVisible}
                onHide={cerrarDialogo}
                style={{ width: '600px' }}
                modal
            >
                <div className="flex flex-column gap-3">
                    <div>
                        <label htmlFor="empresa" className="block mb-2">
                            Empresa
                        </label>

                        <Dropdown
                            id="empresa"
                            value={formulario.id_empresa}
                            options={empresas.map(empresa => ({
                                label: empresa.nombre_empresa,
                                value: empresa.id_empresa
                            }))}
                            onChange={e => actualizarCampo('id_empresa', e.value)}
                            placeholder="Selecciona una empresa"
                            className="w-full"
                            showClear
                        />
                    </div>
                    <div>
                        <label htmlFor="tipo" className="block mb-2">
                            Tipo de dispositivo
                        </label>

                        <Dropdown
                            id="tipo"
                            value={formulario.id_tipo_dispositivo}
                            options={tiposDispositivo.map(opcionesTipo)}
                            onChange={e => actualizarCampo('id_tipo_dispositivo', e.value)}
                            placeholder="Selecciona un tipo de dispositivo"
                            className="w-full"
                            showClear
                        />
                    </div>
                    <div>
                        <label htmlFor="nombre" className="block mb-2">
                            Nombre
                        </label>

                        <InputText
                            id="nombre"
                            value={formulario.nombre}
                            onChange={e => actualizarCampo('nombre', e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="numero_serie" className="block mb-2">
                            Número de serie
                        </label>

                        <InputText
                            id="numero_serie"
                            value={formulario.numero_serie}
                            onChange={e => actualizarCampo('numero_serie', e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="numero_canales" className="block mb-2">
                            Número de canales
                        </label>

                        <InputNumber
                            id="numero_canales"
                            value={formulario.numero_canales}
                            onValueChange={e => actualizarCampo('numero_canales', e.value ?? null)}
                            className="w-full"
                            inputClassName="w-full"
                            min={1}
                            useGrouping={false}
                        />
                    </div>
                    <div>
                        <label htmlFor="id_origen" className="block mb-2">
                            Origen
                        </label>

                        <InputNumber
                            id="id_origen"
                            value={formulario.id_origen}
                            onValueChange={e => actualizarCampo('id_origen', e.value ?? null)}
                            className="w-full"
                            inputClassName="w-full"
                            min={1}
                            max={4}
                            useGrouping={false}
                        />
                    </div>
                    <div>
                        <label htmlFor="observaciones" className="block mb-2">
                            Observaciones
                        </label>

                        <InputText
                            id="observaciones"
                            value={formulario.observaciones}
                            onChange={e => actualizarCampo('observaciones', e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-content-end gap-2">
                        <Button
                            label="Cancelar"
                            severity="secondary"
                            outlined
                            onClick={cerrarDialogo}
                            disabled={guardando}
                        />
                        <Button
                            label="Registrar"
                            icon="pi pi-check"
                            onClick={registrarDispositivo}
                            loading={guardando}
                        />
                    </div>
                </div>
            </Dialog>

            {/*Diálogo de edición */}
            <Dialog
                header="Editar dispositivo"
                visible={dialogoEdicionVisible}
                onHide={cerrarDialogoEdicion}
                style={{ width: '600 px' }}
                modal
            >
                <div className="flex flex-column gap-3">
                    <div>
                        <label htmlFor="empresaEditar" className="block mb-2">
                            Empresa
                        </label>
                        <Dropdown
                            id="empresaEditar"
                            value={formulario.id_empresa}
                            options={empresas.map(empresa => ({
                                label: empresa.nombre_empresa,
                                value: empresa.id_empresa
                            }))}
                            onChange={e => actualizarCampo('id_empresa', e.value)}
                            placeholder="Selecciona una empresa"
                            className="w-full"
                            showClear
                        />
                    </div>
                    <div>
                        <label htmlFor="tipoEditar" className="block mb-2">
                            Tipo de dispositivo
                        </label>
                        <Dropdown
                            id="tipoEditar"
                            value={formulario.id_tipo_dispositivo}
                            options={tiposDispositivo.map(opcionesTipo)}
                            onChange={e => actualizarCampo('id_tipo_dispositivo', e.value)}
                            placeholder="Selecciona un tipo de dispositivo"
                            className="w-full"
                            showClear
                        />
                    </div>
                    <div>
                        <label htmlFor="nombreEditar" className="block mb-2">
                            Nombre
                        </label>
                        <InputText
                            id="nombreEditar"
                            value={formulario.nombre}
                            onChange={e => actualizarCampo('nombre', e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="serieEditar" className="block mb-2">
                            Número de serie
                        </label>
                        <InputText
                            id="serieEditar"
                            value={formulario.numero_serie}
                            onChange={e => actualizarCampo('numero_serie', e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="canalesEditar" className="block mb-2">
                            Número de canales
                        </label>
                        <InputNumber
                            id="canalesEditar"
                            value={formulario.numero_canales}
                            onChange={e => actualizarCampo('numero_canales', e.value ?? null)}
                            className="w-full"
                            inputClassName="w-full"
                            min={1}
                            useGrouping={false}
                        />
                    </div>
                    <div>
                        <label htmlFor="origenEditar" className="block mb-2">
                            Origen
                        </label>
                        <InputNumber
                            id="origenEditar"
                            value={formulario.id_origen}
                            onChange={e => actualizarCampo('id_origen', e.value ?? null)}
                            className="w-full"
                            inputClassName="w-full"
                            min={1}
                            max={4}
                            useGrouping={false}
                        />
                    </div>
                    <div>
                        <label htmlFor="observacionesEditar" className="block mb-2">
                            Observaciones
                        </label>
                        <InputText
                            id="observacionesEditar"
                            value={formulario.observaciones}
                            onChange={e => actualizarCampo('observaciones', e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="flex justify-content-end gap-2">
                        <Button
                            label="Cancelar"
                            severity="secondary"
                            outlined
                            onClick={cerrarDialogoEdicion}
                            disabled={guardando}
                        />
                        <Button
                            label="Guardar cambios"
                            icon="pi pi-check"
                            outlined
                            onClick={actualizarDispositivo}
                            disabled={guardando}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};