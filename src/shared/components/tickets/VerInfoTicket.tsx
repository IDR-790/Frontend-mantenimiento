import { Card } from "primereact/card"
import { TicketStatusBadge } from "../../../tickets/components/TicketStatusBadge"
import { Ticket } from "../../../tickets/types/ticket.types"
import { Image } from "primereact/image"

interface Props {
    ticket: Ticket
}

export const VerInfoTicket = ( { ticket } : Props ) =>{

    return (
        <Card title="Ticket">
            <div className="grid">
                <div className="col-12 md:col-8">
                    <p>
                        <b>Empresa: </b>
                        {ticket.nombreEmpresa || 'N/A'}
                    </p>

                    <p>
                        <b>Código: </b>
                        {ticket.codigo || 'N/A'}
                    </p>
                    <p>
                        <b>Económico: </b>
                        {ticket.eco ?? 'N/A'}
                    </p>
                    <p>
                        <b>Falla reportada: </b>
                        {ticket.falla ?? 'N/A'}
                    </p>

                    <p>
                        <b>Observaciones: </b>
                        {ticket.observaciones || 'N/A'}
                    </p>
                    <p>
                        <b>Estado: </b>
                        <TicketStatusBadge estado={ticket.idEstado} />
                    </p>
                </div>

                <div className="col-12 md:col-4">
                    <p> 
                        <b>Evidencia: </b> 
                    </p>
                    <div className="card flex justify-content-center">
                        { ticket.evidencia === null &&
                                <p>Sin evidencia registrada</p>
                        }
                        { ticket.evidencia !== null &&
                            <Image src={ticket.evidencia}
                                alt="Image" 
                                width="250" 
                                preview 
                            />
                        }
                        
                    </div>
                </div>
            </div>
        </Card>
    )


}