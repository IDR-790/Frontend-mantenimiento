import { Button } from "primereact/button";
import { FichaTecnicaApi } from "../../../tecnicos/types/tecnico.types";
import { Ticket } from "../../../tickets/types/ticket.types";
import { Dialog } from "primereact/dialog";
import { TicketStatusBadge } from "../../../tickets/components/TicketStatusBadge";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { Accordion, AccordionTab } from "primereact/accordion";
import { VerInfoTicket } from "./VerInfoTicket";
import { VerFichasTecnicas } from "./VerFichasTecnicas";

interface Props {
    visible: Boolean | undefined;
    ticket: Ticket | null
    fichas: FichaTecnicaApi[] | null
    onHide: () => void;
}

export const TicketView  = ({
    visible,
    ticket,
    fichas,
    onHide,
}: Props) => {

    if (!ticket) return null;
    
    const FichasAtendidas = (fichas && fichas.length > 0  && fichas[0]?.pasoActual > 0);

    return (
        <Dialog
            visible={visible}
            style={{ width: '920px' }}
            header="Información Ticket v2"
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
            <VerInfoTicket
                ticket = {ticket}
            ></VerInfoTicket>

            { FichasAtendidas &&
                <VerFichasTecnicas
                    fichas = { fichas }
                ></VerFichasTecnicas>
            }
            
        </Dialog>
    );
}