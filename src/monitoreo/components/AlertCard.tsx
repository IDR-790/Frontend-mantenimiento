import { faFileCircleCheck, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fieldset } from 'primereact/fieldset'
import { Alert } from '../LiveMap'
import { Tooltip } from 'primereact/tooltip'

export const AlertCard = ({ 
  index,
  alert,
  handleDeleteAlert,
  handleManageAlert
}:{ 
  index: number;
  alert: Alert;
  handleDeleteAlert: (e:any) => void;
  handleManageAlert: (e:any) => void;
}) => {

  const getTimeAlertAgo = (fecha: Date): number => {
    const now = new Date()
    const ago = now - fecha
    // console.log(Math.ceil((ago)/60000))
    return Math.ceil((ago)/60000)+60
  }

  return (
    <div className="px-2 border-round-xl border-3 bg-red-100 border border-red-600">
      <div className="flex justify-content-between pt-2">
        <span className="font-bold text-lg">
          {alert.nombre}
        </span>
        <span className="flex gap-3 ">
          <Tooltip target=".custom-target-icon"/>
          <FontAwesomeIcon 
            className="custom-target-icon cursor-pointer ml-auto" 
            icon={faFileCircleCheck} 
            onClick={(e: any) => handleManageAlert(alert)}
            data-pr-tooltip="Seguimiento"
            data-pr-position="left"
          />
          <FontAwesomeIcon 
            className="custom-target-icon cursor-pointer ml-auto text-red-800" 
            icon={faTrashCan} 
            onClick={(e: any) => handleDeleteAlert(index)} 
            data-pr-tooltip="Descartar"
            data-pr-position="left"
          />
        </span>
      </div>
      <div className='text-xs font-semibold'>
        {alert.empresa}
      </div>
      <span className="font-semibold text-red-800 text-lg">
        {alert.descripcion}
      </span>
      <p className="text-xs text-gray-800 m-0">Hace {getTimeAlertAgo(new Date(alert.fechaHoraTransmision))} min</p>
      <span className="flex font-semibold text-red-800">

      </span>
      <div>
        <Fieldset
          legend={"Detalles"}
          className="border-none p-0 pb-2"
          toggleable
          collapsed
          expandIcon={"pi pi-angle-down"}
          collapseIcon={"pi pi-angle-up"}
          pt={{
            root: {
              className: "bg-transparent border-0"
            },
            legend: {
              className: "bg-transparent border-none"
            },
            legendTitle: {
              className: "text-sm text-gray-800"
            },
            toggler: {
              className: "p-2"
            },
            togglerIcon: {
              className: "text-gray-800"
            },
            content: {
              className: "bg-red-100 border-round-md flex flex-column gap-2 p-0"
            }
          }}>

          <div className='flex justify-content-between'>
            <span className='font-semibold text-sm'>
              Fecha y Hora
            </span>
            <span className='text-sm'>
              {new Date(alert.fechaHoraTransmision).toLocaleString("es-MX")}
            </span>
          </div>

          <div className='flex justify-content-between'>
            <span className='font-semibold text-sm'>
              Ubicación
            </span>
            <span className='cursor-pointer text-blue-700 hover:text-blue-400 text-sm'>
              {`[${alert.latitud}, ${alert.longitud}]`}
            </span>
          </div>

          <div className='flex justify-content-between'>
            <span className='font-semibold text-sm'>
              Velocidad
            </span>
            <span className='text-sm'>
              {alert.velocidad} Km/Hr
            </span>
          </div>

          <div className='flex justify-content-between'>
            <span className='font-semibold text-sm'>
              Dirección
            </span>
            <span className='text-sm'>
              {alert.direccion}
            </span>
          </div>
        </Fieldset>
      </div>
    </div>
  )
}

