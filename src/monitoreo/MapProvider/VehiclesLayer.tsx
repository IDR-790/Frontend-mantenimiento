import { useEffect } from "react"
import { useMap } from "./useMap"

export const VehiclesLayer = ({ data }: any) => {

  const { map } = useMap()

  useEffect(() => {

    if (!map) return
    
    map.on("load", () => {})
    if (!map.getSource("vehicles")) {

      map.addSource("vehicles", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      })

      map.addLayer({
        id: "vehicles-layer",
        type: "symbol",
        source: "vehicles",
        layout: {
          "icon-image": "vehicle-icon",
          "icon-size": 0.7,
          // "icon-rotate": ["get", "direccion"],
          // "icon-allow-overlap": true
        }
      })
    }

  }, [map])

  useEffect(() => {

    console.log("map222",map?.getSource("vehicles"))
    if (!map || !data) return

    const features = data.map((device: any) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          device.latitud,
          device.longitud,
        ]
      },
      properties: {
        numeroSerie: device.numeroSerie,
        nombre: device.nombre,
        velocidad: device.velocidad,
        direccion: device.direccion,
        fecha_hora: device.fecha_hora,
        numeroCanales: device.numeroCanales
      }
    }))

    const source: any = map.getSource("vehicles")

    if (source) {
      source.setData({
        type: "FeatureCollection",
        features
      })
    }

  }, [data, map])

  return null
}