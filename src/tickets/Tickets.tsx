import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import { Button } from 'primereact/button';
import { FileUploadHandlerEvent } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';

import { TicketDetailDialog } from './components/TicketDetailDialog';
import { TicketFormDialog } from './components/TicketFormDialog';
import { TicketTable } from './components/TicketTable';

import {
    EmpresaOption,
    EquipoSistema,
    Ticket
} from './types/ticket.types';

import { EMPTY_TICKET } from './utils/ticket.constants';
import { getTipoTicket } from './utils/ticket.utils';
import { GeneralContext } from '../shared/GeneralContext';
import { AuthContext } from '../auth/context/AuthContext';
import { useFetch } from '../shared/hooks/useFetch';
import { TicketView } from '../shared/components/tickets/TicketView';
import { FichaTecnicaApi } from '../tecnicos/types/tecnico.types';

export const TicketsIncidencias = () => {

    const { empresas } = useContext(GeneralContext);
    const { tokenSession } = useContext(AuthContext);

    const { getRequest, postRequest } = useFetch();

    const toast = useRef<Toast>(null);

    const TOKEN = tokenSession?.token ?? '';
    const roles: string[] = tokenSession?.rol ?? [];

    const tipoTicketUsuario =
        roles.includes('TICKET-CLIENTE')
            ? 'E'
            : 'I';


    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [listaElementosFallas, setListaElementosFallas] =
        useState<EquipoSistema[]>([]);

    const [ticketForm, setTicketForm] =
        useState<Ticket>(EMPTY_TICKET);

    const [ticketSeleccionado, setTicketSeleccionado] =
        useState<Ticket | null>(null);

    const [selectedEmpresa, setSelectedEmpresa] =
        useState<EmpresaOption | null>(null);

    const [submitted, setSubmitted] =
        useState(false);

    const [nuevoTicketDialog, setNuevoTicketDialog] =
        useState(false);

    const [viewTicketDialog, setViewTicketDialog] =
        useState(false);

    const [viewTicketDialog2, setViewTicketDialog2] =
        useState(false);

    const [fichasTicketSeleccionado, setFichasTicketSeleccionado] =
        useState<FichaTecnicaApi[] | null>(null)

    const empresaOptions = useMemo(
        () =>
            empresas.map((empresa) => ({
                name: empresa.nombre,
                code: empresa.idEmpresa
            })),
        [empresas]
    );


    const resetTicketForm = () => {
        setTicketForm(EMPTY_TICKET);
        setSelectedEmpresa(null);
        setSubmitted(false);
    };

    const openNuevoTicket = () => {
        resetTicketForm();
        setNuevoTicketDialog(true);
    };

    const closeNuevoTicket = () => {
        resetTicketForm();
        setNuevoTicketDialog(false);
    };

    const viewTicket = (ticket: Ticket) => {
        setTicketSeleccionado(ticket);
        setViewTicketDialog(true);
    };

    const viewTicket2 = async (ticket: Ticket) => {

        const historialFichas = (await getRequest({
            url: `${import.meta.env.VITE_API_TICKETS}/ficha/FichasTicket/${ticket.idTicket}`,
            token: TOKEN
        })) as FichaTecnicaApi[];

        console.log(historialFichas)
        setFichasTicketSeleccionado(historialFichas)
        setTicketSeleccionado(ticket);
        setViewTicketDialog2(true);
    };

    const closeViewTicket2 = () => {
        setViewTicketDialog2(false);
        setTicketSeleccionado(null);
    };

    const closeViewTicket = () => {
        setViewTicketDialog(false);
        setTicketSeleccionado(null);
    };

    const onUpload = (
        event: FileUploadHandlerEvent
    ) => {
        const file = event.files[0];

        if (file && file.type !== 'image/png') {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Solo se permiten archivos PNG.',
                life: 3000
            });

            return;
        }

        setTicketForm((prev) => ({
            ...prev,
            archivo: file
        }));

        toast.current?.show({
            severity: 'info',
            summary: 'Éxito',
            detail: 'Imagen PNG cargada correctamente.',
            life: 3000
        });
    };

    const buildTicketFormData = () => {
        if (!selectedEmpresa) {
            return null;
        }

        const formData = new FormData();

        formData.append(
            'idEmpresa',
            String(selectedEmpresa.code)
        );

        formData.append(
            'nombreEmpresa',
            selectedEmpresa.name
        );

        formData.append(
            'tipo',
            getTipoTicket(
                ticketForm.idAreaAtencion,
                tipoTicketUsuario
            )
        );

        formData.append(
            'idAreaAtencion',
            String(ticketForm.idAreaAtencion)
        );

        formData.append(
            'idCatFallaElementoEquipoSistema',
            String(
                ticketForm
                    .idCatFallaElementoEquipoSistema
            )
        );

        if (ticketForm.eco !== null && ticketForm.eco !== undefined && String(ticketForm.eco).trim() !== '') {
            formData.append(
                'eco',
                String(ticketForm.eco).trim()
            );
        }

        if (ticketForm.observaciones.trim()) {
            formData.append(
                'observaciones',
                ticketForm.observaciones.trim()
            );
        }

        if (ticketForm.archivo) {
            formData.append(
                'archivo',
                ticketForm.archivo
            );
        }

        return formData;
    };

    const loadAllData = useCallback(async () => {
        try {
            const [resTickets, resFallas] =
                await Promise.all([
                    getRequest({
                        url:
                            `${import.meta.env.VITE_API_TICKETS}/tickets`,
                        token: TOKEN
                    }),

                    getRequest({
                        url:
                            `${import.meta.env.VITE_API_TICKETS}/falla-equipo-sistema`,
                        token: TOKEN
                    })
                ]);

            const ticketsConEmpresa =
                (resTickets ?? []).map(
                    (item: Ticket) => ({
                        ...item,

                        nombreEmpresa:
                            empresas.find(
                                (empresa) =>
                                    empresa.idEmpresa ===
                                    item.idEmpresa
                            )?.nombre ?? ''
                    })
                );

            setTickets(ticketsConEmpresa);

            setListaElementosFallas(
                resFallas ?? []
            );

        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail:
                    (error?.status === 413 || error?.message === 'Error de conexión')
                        ? 'Error de conexión'
                        : 'Error al cargar los datos de los Tickets.',
                life: 5000
            });
        }
    }, [
        TOKEN,
        empresas,
        // getRequest
    ]);

    useEffect(() => {
        if (!TOKEN) return;

        loadAllData();

        const handleTicketChanged = () => {
            loadAllData();
        };

        window.addEventListener('ticket:changed', handleTicketChanged);
        window.addEventListener('ticket:created', handleTicketChanged);

        return () => {
            window.removeEventListener('ticket:changed', handleTicketChanged);
            window.removeEventListener('ticket:created', handleTicketChanged);
        };
    }, [
        TOKEN,
        loadAllData
    ]);

    const saveTicket = async () => {
        setSubmitted(true);

        const requiereEco = (() => {
            if (!ticketForm.idCatFallaElementoEquipoSistema) return false;
            for (const equipo of listaElementosFallas) {
                for (const el of equipo.elementos ?? []) {
                    if (el.fallas?.some(f => f.idCatFallaElementoEquipoSistema === ticketForm.idCatFallaElementoEquipoSistema)) {
                        return Boolean(el.eco);
                    }
                }
            }
            return false;
        })();

        const isFormValid =
            !!selectedEmpresa &&
            !!ticketForm.idCatFallaElementoEquipoSistema &&
            !!ticketForm.observaciones.trim() &&
            (!requiereEco || (ticketForm.eco !== null && ticketForm.eco !== undefined && String(ticketForm.eco).trim() !== ''));

        if (!isFormValid) {
            return;
        }

        const formData =
            buildTicketFormData();

        if (!formData) {
            return;
        }

        try {
            await postRequest({
                url:
                    `${import.meta.env.VITE_API_TICKETS}/tickets`,
                formData,
                token: TOKEN
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail:
                    'Ticket registrado correctamente.',
                life: 3000
            });

            closeNuevoTicket();

            await loadAllData();

        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail:
                    (error?.status === 413 || error?.message === 'Error de conexión')
                        ? 'Error de conexión'
                        : error?.response?.data?.message ||
                        error?.response?.data?.error ||
                        error?.message ||
                        'No se pudo registrar el ticket.',
                life: 6000
            });
        }
    };

    const leftToolbarTemplate = () => (
        <div className="flex flex-wrap gap-2">
            <Button
                label="Crear Ticket"
                icon="pi pi-plus"
                severity="success"
                onClick={openNuevoTicket}
            />
        </div>
    );

    return (
        <div className="card p-4" data-view="tickets">
            <Toast ref={toast} />

            <Toolbar
                className="mb-4"
                left={leftToolbarTemplate}
            />

            <TicketTable
                tickets={tickets}
                onViewTicket={viewTicket}
                onViewTicket2={viewTicket2}
            />

            <TicketFormDialog
                visible={nuevoTicketDialog}
                ticket={ticketForm}
                submitted={submitted}
                selectedEmpresa={selectedEmpresa}
                empresaOptions={empresaOptions}
                listaElementosFallas={
                    listaElementosFallas
                }
                onHide={closeNuevoTicket}
                onSave={saveTicket}
                onTicketChange={setTicketForm}
                onEmpresaChange={setSelectedEmpresa}
                onUpload={onUpload}
            />

            <TicketDetailDialog
                visible={viewTicketDialog}
                ticket={ticketSeleccionado}
                onHide={closeViewTicket}
            />

            <TicketView
                visible={viewTicketDialog2}
                ticket={ticketSeleccionado}
                fichas={fichasTicketSeleccionado}
                onHide={closeViewTicket2}
            />
        </div>
    );
};
