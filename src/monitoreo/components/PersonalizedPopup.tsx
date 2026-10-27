import { faClock, faGaugeHigh, faLocationArrow, faLocationDot, faPersonArrowUpFromLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Popup } from 'react-leaflet';
import { IconButton } from '../../shared/components/IconButton';

export const PersonalizedPopup = ({
  deviceName,
  company,
  speed,
  direction,
  ocupation,
  latitude,
  longitude,
  timestamp,
  alerts,
  channels,
  setVisibleVideo,
  setVisibleDetails
}: {
  deviceName: string;
  company?: string;
  speed: string;
  direction: string;
  ocupation: string;
  latitude: string;
  longitude: string;
  timestamp: string;
  alerts: number;
  channels: number;
  setVisibleVideo: (e: any) => void;
  setVisibleDetails: (e: any) => void;
}) => {
  return (
    <Popup>

      {/* HEADER */}
      <div className="flex flex-column">
        <span className="text-xl font-bold">{deviceName}</span>
        <span className="font-bold">{company}</span>
      </div>

      <hr />
      {/* CONTENEDOR */}
      <div className="flex flex-column gap-2">
        
      {/* OCUPACIÓN */}
      <div className="w-full text-center">
        <div className="flex align-items-center">
          <IconButton
            icon={<FontAwesomeIcon
              icon={faPersonArrowUpFromLine} />}
            color={'green'}
            size={'sm'}
          />
          <span className="mx-2 font-semibold">
            Ocupación:
          </span>
          <span className="ml-auto">
            {ocupation}
          </span>
        </div>
      </div>

      {/* VELOCIDAD */}
        <div className="w-full text-center">
          <div className="flex align-items-center">
            <IconButton
              icon={<FontAwesomeIcon icon={faGaugeHigh} />}
              color={'green'}
              size={'sm'}
            />
            <span className="mx-2 font-semibold">
              Velocidad:
            </span>
            <span className="ml-auto">
              {speed} Km/hr
            </span>
          </div>
        </div>

        {/* DIRECCIÓN */}
        <div className="w-full text-center">
          <div className="flex align-items-center">
            <IconButton
              icon={<FontAwesomeIcon
                icon={faLocationArrow} />}
              color={'green'}
              size={'sm'}
            />
            <span className="mx-2 font-semibold">
              Dirección:
            </span>
            <span className="ml-auto">
              {direction}
            </span>
          </div>
        </div>

        {/* UBICACIÓN */}
        <div className="w-full text-center">
          <div className="flex align-items-center">
            <IconButton
              icon={<FontAwesomeIcon
                icon={faLocationDot} />}
              color={'green'}
              size={'sm'}
            />
            <span className="mx-2 font-semibold">
              Ubicación:
            </span>
            <div className="flex flex-column ml-auto text-right">
              <span>
                {latitude}
              </span>
              <span>
                {longitude}
              </span>
            </div>
          </div>
        </div>

        {/* FECHA Y HORA DE REPORTE */}
        <div className="flex align-items-center">
          <IconButton
            icon={<FontAwesomeIcon
              icon={faClock} />}
            color={'green'}
            size={'sm'}
          />
          <span className="ml-1 text-right">
            {new Date(timestamp).toLocaleString("es-MX")}
          </span>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="mt-2 flex justify-content-center gap-2 ">
        {!!channels 
          && <Button
          icon="pi pi-video"
          severity="info"
          size="small"
          tooltip="Abrir Video"
          onClick={() => {
            setVisibleVideo((prev: boolean) => !prev);
          }}
        >
          <Badge value={channels} severity="info"></Badge>
        </Button>}

        {!!alerts 
          && <Button
          icon="pi pi-bell"
          severity="danger"
          size="small"
          tooltip="Detalle de Alarmas"
          onClick={(e: any) => {
            console.log(e.target)
            setVisibleDetails((prev: boolean) => !prev )
          }}
        >
          <Badge value={alerts} severity="danger"></Badge>
        </Button>}
      </div>

    </Popup>
  )
}