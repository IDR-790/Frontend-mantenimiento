import { Marker, useMap } from "react-leaflet"
import { useContext, useEffect, useRef } from "react"
import L from "leaflet"
import { PersonalizedPopup } from "../components/PersonalizedPopup"
import { useQuery } from "@tanstack/react-query"
import { useFetch } from "../../shared/hooks/useFetch"
import { AuthContext } from "../../auth/context/AuthContext"

export interface Vehicle {
  idDispositivo: number;
  latitud: number;
  longitud: number;
  altitud: number;
  direccion: number;
  velocidad: number;
  fecha_hora: string;
  numeroSerie: string;
  numeroCanales: number;
  nombre: string;
}

export const VehiclesLayer = ({ data, markersRef, setVisibleVideo }: any) => {


  if (!data) return null

  return (
    <>
      {data.map((device: Vehicle) => (

        <Marker
          key={device.numeroSerie}
          position={[device.latitud, device.longitud]}
          ref={(ref) => {

            if (!ref) return

            markersRef.current.set(
              device.numeroSerie,
              ref
            )
          }}
        >

          <PersonalizedPopup
            deviceName={device.nombre}
            speed={device.velocidad.toString()}
            direction={device.direccion.toString()}
            ocupation={"0"}
            latitude={device.latitud.toString()}
            longitude={device.longitud.toString()}
            timestamp={device.fecha_hora}
            alerts={0}
            channels={device.numeroCanales}
            setVisibleVideo={setVisibleVideo}
            setVisibleDetails={() => { }}
          />

        </Marker>

      ))}
    </>
  )

}
