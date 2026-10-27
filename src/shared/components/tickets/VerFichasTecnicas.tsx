import { Card } from "primereact/card"
import { FichaTecnicaApi } from "../../../tecnicos/types/tecnico.types"
import { Accordion, AccordionTab } from "primereact/accordion"


interface Props {
    fichas: FichaTecnicaApi[] | null
}

export const VerFichasTecnicas = ({ fichas }: Props) =>{    

    return (
        <Card title="Detalles">
            <Accordion activeIndex={0}>

                { 
                    fichas?.map((ficha) => (
                        <AccordionTab 
                            // key={ ficha.idFicha }
                            header={
                                <div>
                                    <div className="flex align-items-center">
                                        <i className="pi pi-ticket mr-2"></i>
                                        <span className="vertical-align-middle">Ficha tecnica</span>
                                    </div>
                                </div>
                            }
                        >

                            {/* 
                            ----Liberacion del ticket
                            id_liberacion
                            id_ticket
                            motivo
                            estatus
                            created_at
                            created_user
                            updated_at
                            updated_user
                            deleted_at
                            deleted_user
                            ----Parte de la ficha
                            id_ficha
                            id_ticket
                            fecha_atencion
                            fecha_cierre
                            tiempo_respuesta
                            tiempo_elevado
                            motivo_tiempo_elevado
                            observaciones
                            evidencia
                            created_at
                            created_user
                            updated_at
                            updated_user
                            deleted_at
                            deleted_user
                            ubicacion_atencion
                            id_cat_falla_equipo_sistema
                            reporte_extra
                            id_estado_ficha
                            paso_actual 
                            --- detalle de la ficha
                            id_ficha_detalle
                            id_ficha
                            id_accesorio_diagnostico
                            id_accesorio_reparacion
                            created_at
                            created_user
                            updated_at
                            updated_user
                            deleted_at
                            deleted_user
                            --- Espera de refaccion
                            id_espera_refaccion
                            pieza
                            estatus
                            created_at
                            created_user
                            updated_at
                            updated_user
                            deleted_at
                            deleted_user
                            id_ficha_detalle
                            id_estado_refaccion

                            */}

                        Contenido
                        - Detalle Generales de la Ficha | en el componente de VerInfoTicket

                        -- por cada detalle 
                        <div className="grid">
                            <div className="col-12">
                                <label className="font-bold block mb-2">
                                    Diagnostico: 
                                </label>

                                *** Por cada reparacion 
                                <label className="font-bold block mb-2">
                                    Reparaciones: 
                                </label>
                            </div>

                        </div>

                       
                        - Diagnosticos 
                        - Reparaciones
                        - Observaciones
                        - evidencia

                        </AccordionTab>
                    ))  
                    
                }
                        
                
            </Accordion>
        </Card>
    )

}