import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuItem, MySidebar } from "../shared/components/menus/MySidebar";
import { faArrowsSpin, faArrowsTurnToDots, faBorderAll, faBoxesStacked, faBridgeCircleCheck, faBus, faCalendarCheck, faCalendarDays, faCalendarWeek, faChartLine, faCheckToSlot, 
    faClipboardList, faDroplet, faFileCircleCheck, faFileContract, faFileInvoice, faFileInvoiceDollar, faFileShield, faFileVideo, faFutbol, faGasPump, faGears, faHandHoldingDollar, 
    faIdCard, faListCheck, faLocationCrosshairs, faMapLocationDot, faMoneyBillTransfer, faPeopleGroup, faPeopleLine, faPersonCircleExclamation, faRankingStar, faRoute, faScrewdriverWrench,
    faTabletScreenButton, faTimeline, faToolbox, faTrafficLight, faUserCheck, faUserSecret, faUsersGear, faVanShuttle, faWrench, faClipboardUser, faHouseLaptop, faAddressCard, faHouse,
    faUserClock, faTruck, faFilePowerpoint, faBroom, faTicket } from "@fortawesome/free-solid-svg-icons";
import { DashboardPage } from "../dashboard/DashboardPage";
import { MonitoreoPage } from "../monitoreo/MonitoreoPage";
import { MonitoringPage } from "../monitoreo/MonitoringPage";
import { useNavigate } from "react-router-dom"
import { faFileLines } from "@fortawesome/free-regular-svg-icons";

import { TicketsIncidencias } from "../tickets/Tickets";

import { LiveMap } from "../monitoreo/LiveMap";
import { VideoCentral } from "../monitoreo/VideoCentral";
import { AlertsManagement } from "../monitoreo/AlertsManagement";
import { TiposDispositivoPage } from "../tipos-dispositivo/TiposDispositivoPage";

export const MainMenu = ({ setPage }: { setPage: (e: any) => void }) => {

    const navigate = useNavigate()

    const items: MenuItem[] = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: <FontAwesomeIcon key={"faBorderAll"} icon={faBorderAll} className="mr-2" />,
            command: () => setPage(<DashboardPage />),
        },
        // {
            // id: "unidades_operadores",
            // label: "Unidades y Operadores",
            // icon: <FontAwesomeIcon key={"faBus"} icon={faBus} className="mr-2" />,
            // items: [
            //     {
            //         id: "disponibilidad",
            //         label: "Disponibilidad",
            //         icon: <FontAwesomeIcon key={"faListCheck"} icon={faListCheck} className="mr-2" />,
            //         command: () => { navigate("/monitoreo") },
            //     },
                // {
                //    id: "ranking",
                //    label: "Ranking",
                //    icon: <FontAwesomeIcon key={"faRankingStar"} icon={faRankingStar} className="mr-2" />,
                // },
                // {
                //     id: "operadores",
                //     label: "Operadores",
                //     icon: <FontAwesomeIcon key={"faPeopleGroup"} icon={faPeopleGroup} className="mr-2" />,
                //     items: [
                        //{
                        //    id: "vigencias",
                        //    label: "Vigencias",
                        //    icon: <FontAwesomeIcon key={"faTimeline"} icon={faTimeline} className="mr-2" />,
                        //},
                        //{
                        //    id: "alertas_vencimiento_licencias",
                        //    label: "Alertas de Vencimiento",
                        //    icon: <FontAwesomeIcon key={"faCalendarDays"} icon={faCalendarDays} className="mr-2" />,
                        //
                        //}
                //     ]
                // },
                // {
                //     id: "unidades",
                //     label: "Unidades",
                //     icon: <FontAwesomeIcon key={"faVanShuttle"} icon={faVanShuttle} className="mr-2" />,
                //     items: [
                        //{
                        //    id: "tarjeton",
                        //    label: "Tarjetón",
                        //    icon: <FontAwesomeIcon key={"faFileInvoice"} icon={faFileInvoice} className="mr-2" />,
                        //},

                        //{
                        //    id: "factura",
                        //    label: "Factura",
                        //    icon: <FontAwesomeIcon key={"faFileInvoiceDollar"} icon={faFileInvoiceDollar} className="mr-2" />,
                        //},

                        //{
                        //    id: "poliza_seguro",
                        //    label: "Póliza de Seguro",
                        //    icon: <FontAwesomeIcon key={"faFileContract"} icon={faFileContract} className="mr-2" />,
                        //},

                        //{
                        //    id: "verificacion",
                        //    label: "Verificación",
                        //    icon: <FontAwesomeIcon key={"faBridgeCircleCheck"} icon={faBridgeCircleCheck} className="mr-2" />,
                        //},

                        //{
                        //    id: "tramites_vehiculares",
                        //    label: "Trámites Vehículares",
                        //    icon: <FontAwesomeIcon key={"faClipboardList"} icon={faClipboardList} className="mr-2" />,
                        //}
                    // ]
                // },
                
        //     ]
        // },
        {
            id: "tickets",
            label: "Tickets de Incidencias",
            icon: <FontAwesomeIcon key={"faTicket"} icon={faTicket} className="mr-2" />,
            command: () => setPage(<TicketsIncidencias />),
        },
        {
            id: "tipos-dispositivo",
            label: "Tipos de dispositivo",
            icon: <FontAwesomeIcon key={"faTabletScreenButton"} icon={faTabletScreenButton} className="mr-2" />,
            command: () => setPage(<TiposDispositivoPage />)
        }
        // {
        //     id: "programacion_despacho",
        //     label: "Programación y Despacho",
        //     icon: <FontAwesomeIcon key={"faCalendarDays"} icon={faCalendarDays} className="mr-2" />,
        //     command: () => { },
        //     items: [
        //         {
        //             id: "rutas",
        //             label: "Rutas",
        //             icon: <FontAwesomeIcon key={"faPeopleGroup"} icon={faPeopleGroup} className="mr-2" />,
        //         },
        //         {
        //             id: "rol",
        //             label: "Rol",
        //             icon: <FontAwesomeIcon key={"faCalendarCheck"} icon={faCalendarCheck} className="mr-2" />
        //         },
        //         {
        //             id: "operacion_diaria",
        //             label: "Operación Diaria",
        //             icon: <FontAwesomeIcon key={"faTrafficLight"} icon={faTrafficLight} className="mr-2" />
        //         }
        //     ]
        // },
        // {
        //     id: "monitoreo_en_tiempo_real",
        //     label: "Monitoreo en Tiempo Real",
        //     icon: <FontAwesomeIcon key={"faLocationCrosshairs"} icon={faLocationCrosshairs} className="mr-2" />,
        //     items: [
        //         {
        //             id: "mapa",
        //             label: "Mapa",
        //             icon: <FontAwesomeIcon key={"faMapLocationDot"} icon={faMapLocationDot} className="mr-2" />,
        //             command: () => setPage(<LiveMap />),

        //         },
        //         {
        //             id: "centro_video",
        //             label: "Centro de Video",
        //             icon: <FontAwesomeIcon key={"faFileVideo"} icon={faFileVideo} className="mr-2" />,
        //             command: () => setPage(<VideoCentral />)
        //         },
        //         {
        //             id: "gestion_alertas",
        //             label: "Gestión de Alertas",
        //             icon: <FontAwesomeIcon key={"faFileCircleCheck"} icon={faFileCircleCheck} className="mr-2" />,
        //             command: () => setPage(<AlertsManagement />),
        //         }
        //     ]
        // },
        // {
        //     id: "mantenimiento",
        //     label: "Mantenimiento",
        //     icon: <FontAwesomeIcon key={"faWrench"} icon={faWrench} className="mr-2" />,
        //     command: () => { },
        //     items: [
        //         {
        //             id: "preventivo",
        //             label: "Preventivo",
        //             icon: <FontAwesomeIcon key={"faCalendarWeek"} icon={faCalendarWeek} className="mr-2" />,
        //         },
        //         {
        //             id: "correctivo",
        //             label: "Correctivo",
        //             icon: <FontAwesomeIcon key={"faScrewdriverWrench"} icon={faScrewdriverWrench} className="mr-2" />,
        //         }
        //     ]
        // },
        // {
        //     id: "recaudo_pasajeros",
        //     label: "Recaudo y Pasajeros",
        //     icon: <FontAwesomeIcon key={"faHandHoldingDollar"} icon={faHandHoldingDollar} className="mr-2" />,
        //     command: () => { },
        //     items: [
        //         {
        //             id: "peaje",
        //             label: "Peaje",
        //             icon: <FontAwesomeIcon key={"faTabletScreenButton"} icon={faTabletScreenButton} className="mr-2" />,
        //         },
        //         {
        //             id: "pasajeros",
        //             label: "Pasajeros",
        //             icon: <FontAwesomeIcon key={"faUserCheck"} icon={faUserCheck} className="mr-2" />,
        //         },
        //         {
        //             id: "conciliacion",
        //             label: "Conciliación",
        //             icon: <FontAwesomeIcon key={"faMoneyBillTransfer"} icon={faMoneyBillTransfer} className="mr-2" />,
        //         }
        //     ]
        // },
        // {
        //     id: "diesel",
        //     label: "Diesel",
        //     icon: <FontAwesomeIcon key={"faGasPump"} icon={faGasPump} className="mr-2" />,
        //     command: () => { },
        //     items: [
        //         {
        //             id: "control de carga",
        //             label: "Control de Cargas",
        //             icon: <FontAwesomeIcon key={"faDroplet"} icon={faDroplet} className="mr-2" />
        //         }
        //     ]
        // },
        // {
        //     id: "neumaticos",
        //     label: "Neumáticos",
        //     icon: <FontAwesomeIcon key={"faFutbol"} icon={faFutbol} className="mr-2" />,
        //     command: () => { },
        //     items: [
        //         {
        //             id: "control_neumaticos",
        //             label: "Control de Neumáticos",
        //             icon: <FontAwesomeIcon key={"faBoxesStacked"} icon={faBoxesStacked} className="mr-2" />
        //         },
        //         {
        //             id: "asignacion_neumaticos",
        //             label: "Asignación de Neumáticos",
        //             icon: <FontAwesomeIcon key={"faArrowsTurnToDots"} icon={faArrowsTurnToDots} className="mr-2" />,
        //         },
        //         {
        //             id: "ciclos_de_vida_neumaticos",
        //             label: "Ciclos de Vida",
        //             icon: <FontAwesomeIcon key={"faArrowsSpin"} icon={faArrowsSpin} className="mr-2" />,
        //         }
        //     ]
        // },
        // {
        //     id: "reportes_bi",
        //     label: "Reportes y BI",
        //     icon: <FontAwesomeIcon key={"faChartLine"} icon={faChartLine} className="mr-2" />,
        //     command: () => { },
        //     items: [
        //         {
        //             id: "operacion",
        //             label: "Operación",
        //             icon: <FontAwesomeIcon key={"faRoute"} icon={faRoute} className="mr-2" />
        //         },
        //         {
        //             id: "reporte_pasajeros_recaudo",
        //             label: "Pasajeros y Recaudo",
        //             icon: <FontAwesomeIcon key={"faPeopleLine"} icon={faPeopleLine} className="mr-2" />
        //         },
        //         {
        //             id: "reportes_disponibilidad",
        //             label: "Disponibilidad",
        //             icon: <FontAwesomeIcon key={"faCheckToSlot"} icon={faCheckToSlot} className="mr-2" />
        //         },
        //         {
        //             id: "reportes_mantenimiento",
        //             label: "Mantenimiento",
        //             icon: <FontAwesomeIcon key={"faToolbox"} icon={faToolbox} className="mr-2" />
        //         },
        //         {
        //             id: "costos_seguridad",
        //             label: "Costos y Seguridad",
        //             icon: <FontAwesomeIcon key={"faFileShield"} icon={faFileShield} className="mr-2" />
        //         }
        //     ]
        // },
        // {
        //     id: "configuracion",
        //     label: "Configuración",
        //     icon: <FontAwesomeIcon key={"faGears"} icon={faGears} className="mr-2" />,
        //     command: () => { },
        //     items: [
        //         {
        //             id: "usuarios",
        //             label: "Usuarios",
        //             icon: <FontAwesomeIcon key={"faUsersGear"} icon={faUsersGear} className="mr-2" />
        //         },
        //         {
        //             id: "roles_permisos",
        //             label: "Roles y Permisos",
        //             icon: <FontAwesomeIcon key={"faUserSecret"} icon={faUserSecret} className="mr-2" />
        //         }
        //     ]
        // }
    ];

    const activeClassName = '{"background": "linear-gradient(135deg,#b10f5c 0%,#6a1b6f 35%,#2b2f77 65%,#0f4c81 100%)", "color":"white", "borderTopRightRadius": "2rem", "borderBottomRightRadius": "2rem" }'


    return (
        <>
            <MySidebar items={items} activeClassName={activeClassName} defaultItemActive={"dashboard"} />
        </>
    )
}