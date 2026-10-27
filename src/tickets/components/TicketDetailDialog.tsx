import { useContext, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Image } from 'primereact/image';
import { Ticket, TicketsFichas } from '../types/ticket.types';
import { getAreaAtencionNombre } from '../utils/ticket.utils';
import { fetchFichasPorTicket } from './consulta/service';
import { AuthContext } from '../../auth/context/AuthContext';
import { useFetch } from '../../shared/hooks/useFetch';
import { EvidenciaItem } from './EvidenciaItem';

interface Props {
    visible: boolean;
    ticket: Ticket | null;
    onHide: () => void;
}

export const TicketDetailDialog = ({
    visible,
    ticket,
    onHide
}: Props) => {
    const { tokenSession } = useContext(AuthContext);
    const { getRequest } = useFetch();

    const [fichas, setFichas] = useState<TicketsFichas[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (visible && ticket?.idTicket) {
            setLoading(true);
            fetchFichasPorTicket(tokenSession?.token, getRequest, ticket.idTicket)
                .then((data) => {
                    setFichas(data || []);
                })
                .catch((err) => {
                    console.error('Error al cargar fichas técnicas:', err);
                    setFichas([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setFichas([]);
        }
    }, [visible, ticket?.idTicket]);

    if (!ticket) return null;

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return 'N/A';
        try {
            const d = new Date(date);
            return isNaN(d.getTime())
                ? String(date)
                : d.toLocaleString('es-MX', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
        } catch {
            return String(date);
        }
    };

    /**
     * Estados del ticket:
     * 1: Abierto
     * 2: Espera de Refacción
     * 3: Cerrado
     * 4: No Procedente
     * 5: En Atención
     */
    const getEstadoTicketTexto = (idEstado?: number) => {
        switch (idEstado) {
            case 1:
                return 'Abierto';
            case 2:
                return 'Espera de Refacción';
            case 3:
                return 'Cerrado';
            case 4:
                return 'No Procedente';
            case 5:
                return 'En Atención';
            default:
                return 'Desconocido';
        }
    };

    /**
     * Estados de la ficha técnica:
     * 1: Pendiente
     * 2: En atención
     * 3: En espera de refacción
     * 4: Finalizada
     */
    const getEstadoFichaTexto = (idEstado?: number, fallbackDesc?: string) => {
        if (fallbackDesc) return fallbackDesc;
        switch (idEstado) {
            case 1:
                return 'Pendiente';
            case 2:
                return 'En Atención';
            case 3:
                return 'En Espera de Refacción';
            case 4:
                return 'Finalizada';
            default:
                return 'Sin Estado';
        }
    };

    /**
     * Estados de las refacciones:
     * 1: Pendiente
     * 2: Recibida
     * 3: Instalada
     * 4: Cancelada
     */
    const getEstadoRefaccionTexto = (idEstado?: number, fallbackDesc?: string) => {
        if (fallbackDesc) return fallbackDesc;
        switch (idEstado) {
            case 1:
                return 'Pendiente';
            case 2:
                return 'Recibida';
            case 3:
                return 'Instalada';
            case 4:
                return 'Cancelada';
            default:
                return 'N/A';
        }
    };

    return (
        <Dialog
            visible={visible}
            style={{ width: '960px', maxWidth: '95vw' }}
            header="Información Completa del Ticket"
            modal
            className="p-fluid"
            onHide={onHide}
            footer={
                <Button
                    label="Cerrar"
                    icon="pi pi-times"
                    onClick={onHide}
                />
            }
        >
            {/* Información General del Ticket */}
            <div className="surface-card border-1 surface-border border-round p-3 mb-4">
                <div className="text-lg font-bold text-900 mb-3 flex align-items-center gap-2">
                    <i className="pi pi-ticket text-primary"></i>
                    Datos del Ticket
                </div>
                <div className="grid">
                    <div className="col-12 md:col-6">
                        {/* <p className="mb-2">
                            <span className="font-bold text-700">ID Ticket:</span> {ticket.idTicket}
                        </p> */}
                        <p className="mb-2">
                            <span className="font-bold text-700">Empresa:</span> {ticket.nombreEmpresa}
                        </p>
                        <p className="mb-2">
                            <span className="font-bold text-700">Folio:</span>{' '}
                            <span className="font-bold text-blue-600">{ticket.codigo}</span>
                        </p>
                        {/* <p className="mb-2">
                            <span className="font-bold text-700">Área de atención:</span>{' '}
                            {getAreaAtencionNombre(ticket)}
                        </p> */}
                        <p className="mb-2">
                            <span className="font-bold text-700">Número económico:</span>{' '}
                            {ticket.eco ?? 'N/A'}
                        </p>
                        <p className="mb-2">
                            <span className="font-bold text-700">Falla Reportada:</span>{' '}
                            {ticket.falla ?? ticket.fallaTexto ?? 'N/A'}
                        </p>
                        <p className="mb-2">
                            <span className="font-bold text-700">Observaciones:</span>{' '}
                            {ticket.observaciones || 'N/A'}
                        </p>
                        <p className="mb-2">
                            <span className="font-bold text-700">Estado:</span>{' '}
                            <span className="text-800">{getEstadoTicketTexto(ticket.idEstado)}</span>
                        </p>
                    </div>

                    <div className="col-12 md:col-6">



                        <p className="mb-2">
                            <span className="font-bold text-700">Evidencia:</span><p></p>{' '}
                            {ticket.evidencia === null &&
                                <p> Sin evidencia registrada</p>
                            }
                            {ticket.evidencia !== null &&
                                <Image src={ticket.evidencia}
                                    alt="Evidencia"
                                    width="250"
                                    preview
                                />
                            }
                        </p>

                    </div>
                </div>
            </div>

            <Divider align="left">
                <span className="p-tag p-tag-info font-medium text-sm flex align-items-center gap-2 px-3 py-1">
                    <i className="pi pi-folder-open"></i>
                    Fichas Técnicas ({fichas.length})
                </span>
            </Divider>

            {/* Listado de Fichas Técnicas */}
            {loading ? (
                <div className="flex flex-column align-items-center justify-content-center p-5">
                    <ProgressSpinner style={{ width: '45px', height: '45px' }} />
                    <span className="text-500 mt-2 font-medium">Cargando fichas técnicas...</span>
                </div>
            ) : fichas.length === 0 ? (
                <div className="surface-ground border-round p-4 text-center text-500 font-medium my-3">
                    <i className="pi pi-info-circle mr-2 text-primary"></i>
                    No hay fichas técnicas registradas para este ticket.
                </div>
            ) : (
                <div className="flex flex-column gap-4 my-2">
                    {fichas.map((ficha, index) => {
                        // Agrupar refacciones de todos los detalles de la ficha
                        const todasRefacciones = (ficha.detalles || []).flatMap(
                            (det) => det.refacciones || []
                        );

                        return (
                            <div
                                key={ficha.idFichaTecnica ?? index}
                                className="surface-card border-1 surface-border border-round shadow-1 p-4"
                            >
                                {/* Encabezado de la Ficha: Columna Izquierda y Columna Derecha */}
                                <div className="grid border-bottom-1 surface-border pb-3 mb-3">
                                    <div className="w-full">
                                        <p className="mb-2">
                                            <span className="font-bold text-700">Falla Reportada:</span>
                                            <span className="text-800">{ficha.elemento?.Equipo?.nombre || 'N/A'}{' -> '}{ficha.elemento?.nombre || 'N/A'}{' -> '}{ficha.falla?.descripcion || 'N/A'}</span>
                                        </p>

                                    </div>
                                </div>


                                {/* Apartado de Detalles: Diagnósticos y sus Reparaciones */}
                                <div className="mb-3">
                                    {!ficha.detalles || ficha.detalles.length === 0 ? (
                                        <div>
                                            <div className="font-semibold text-900 mb-2 flex align-items-center gap-2">
                                                <i className="pi pi-wrench text-primary"></i>
                                                <span>Diagnósticos y Reparaciones</span>
                                            </div>
                                            <div className="surface-50 border-1 surface-border border-round p-2 text-500 text-sm italic w-full">
                                                Sin detalles técnicos registrados.
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="grid mb-1">
                                                <div className="col-12 md:col-6 pb-0">
                                                    <div className="font-semibold text-900 flex align-items-center gap-2">
                                                        <i className="pi pi-search text-primary"></i>
                                                        <span>Diagnósticos</span>
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-6 pb-0">
                                                    <div className="font-semibold text-900 flex align-items-center gap-2">
                                                        <i className="pi pi-wrench text-primary"></i>
                                                        <span>Reparaciones</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-column gap-2">
                                                {ficha.detalles.map((detalle, detIdx) => {
                                                    const diagTexto =
                                                        detalle.diagnostico && detalle.diagnostico.length > 0
                                                            ? detalle.diagnostico.map((d) => d.descripcion).filter(Boolean).join(', ')
                                                            : 'Sin diagnóstico';

                                                    const repTexto =
                                                        detalle.reparacion && detalle.reparacion.length > 0
                                                            ? detalle.reparacion.map((r) => r.descripcion).filter(Boolean).join(', ')
                                                            : 'Sin reparación';

                                                    return (
                                                        <div key={detalle.idFichaDetalle ?? detIdx} className="grid">
                                                            <div className="col-12 md:col-6">
                                                                <div className="surface-50 border-round p-2 border-1 surface-border text-800 h-full flex align-items-center">
                                                                    <span>{diagTexto}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 md:col-6">
                                                                <div className="surface-50 border-round p-2 border-1 surface-border text-800 h-full flex align-items-center">
                                                                    <span>{repTexto}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Apartado de Refacciones (al final) */}
                                <div className="mb-3">
                                    <div className="font-semibold text-900 mb-2 flex align-items-center gap-2">
                                        <i className="pi pi-box text-primary"></i>
                                        <span>Refacciones</span>
                                    </div>

                                    {todasRefacciones.length === 0 ? (
                                        <div className="surface-50 border-1 surface-border border-round p-2 flex align-items-center justify-content-between gap-2 w-full">
                                            No se solicitaron refacciones para esta ficha.
                                        </div>
                                    ) : (
                                        <div className="flex flex-column gap-2">
                                            {todasRefacciones.map((ref, refIdx) => {
                                                const idEstado = ref.estadoRefaccion?.idEstadoRefaccion ?? ref.idEstadoRefaccion;
                                                const esInstalada = idEstado === 3 || ref.estadoRefaccion?.descripcion?.toLowerCase() === 'instalada';
                                                const fechaRefaccion = ref.updatedAt || ref.createdAt;
                                                const mostrarFecha = esInstalada && Boolean(fechaRefaccion);

                                                return (
                                                    <div
                                                        key={ref.idEsperaRefaccion ?? refIdx}
                                                        className="surface-50 border-1 surface-border border-round p-2 flex align-items-center justify-content-between gap-2 w-full"
                                                    >
                                                        <div className="flex align-items-center gap-2">
                                                            <i className="pi pi-cog text-500"></i>
                                                            <span className="font-medium text-800">
                                                                {ref.pieza || 'Refacción sin nombre'}
                                                            </span>
                                                        </div>



                                                        <div>
                                                            <span className="text-sm font-medium text-700">
                                                                Estado:{' '}
                                                                {getEstadoRefaccionTexto(
                                                                    idEstado,
                                                                    ref.estadoRefaccion?.descripcion
                                                                )}
                                                            </span>
                                                        </div>

                                                        {mostrarFecha && (
                                                            <div className="flex align-items-center gap-2 text-sm text-700">
                                                                <i className="pi pi-calendar text-500"></i>
                                                                <span>
                                                                    <span className="font-medium">Fecha de Instalación:</span> {formatDate(fechaRefaccion)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>




                                <div className="font-semibold text-900 mb-2">
                                    <div className="flex align-items-center gap-2 mb-2">
                                        <i className="pi pi-image text-primary"></i>
                                        <span>Evidencias {ficha.evidencias && ficha.evidencias.length > 0 ? `(${ficha.evidencias.length})` : ''}:</span>
                                    </div>
                                    {ficha.evidencias && ficha.evidencias.length > 0 ? (
                                        <div className="flex flex-wrap gap-3 pl-2 pt-1">
                                            {ficha.evidencias.map((ev, evIdx) => {
                                                const nombreArchivo = typeof ev === 'string' ? ev : (ev as any)?.nombre || '';
                                                return (
                                                    <EvidenciaItem
                                                        key={`${ficha.idFichaTecnica}-${nombreArchivo}-${evIdx}`}
                                                        nombre={nombreArchivo}
                                                        token={tokenSession?.token}
                                                        getRequest={getRequest}
                                                        idFicha={ficha.idFichaTecnica}
                                                        index={evIdx}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-800 font-normal pl-4">Sin evidencias</span>
                                    )}
                                </div>
                                <div className="font-semibold text-900 mb-2 flex align-items-center justify-content-around gap-2 md:flex-row flex-column" >
                                    <div className="flex align-items-center gap-2 ">
                                        <i className="pi pi-clock text-primary"></i>
                                        <span>Fecha de Atención:</span>{' '}
                                        <span className="text-800">{formatDate(ficha.fechaAtencion)}</span>
                                    </div>
                                    <div className="flex align-items-center gap-2">
                                        <i className="pi pi-clock text-primary"></i>
                                        <span>Fecha de Cierre:</span>{' '}
                                        <span className="text-800">{formatDate(ficha.fechaCierre)}</span>
                                    </div>
                                </div>


                            </div>
                        );
                    })}
                </div>
            )}
        </Dialog>
    );
};
