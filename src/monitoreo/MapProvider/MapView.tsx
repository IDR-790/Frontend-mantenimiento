import { useContext, useEffect, useRef, useState } from "react"
import maplibregl from "maplibre-gl"
import { MapContext } from "./MapContext"
import { VehiclesLayer } from "./VehiclesLayer"
import { useQuery } from "@tanstack/react-query"
import { useFetch } from "../../shared/hooks/useFetch"
import { AuthContext } from "../../auth/context/AuthContext"
const bus = new URL('/icons/3.png', import.meta.url).href;

export const MapView = ({ children }: any) => {

  const containerRef = useRef(null)
  const fetch = useFetch();
  const { tokenSession, logged } = useContext(AuthContext);
  const [map, setMap] = useState<maplibregl.Map | null>(null)
  const { data, status } = useQuery({
    queryKey: ["ultima-ubicacion"],
    queryFn: () => fetch.getRequest({ url: `${import.meta.env.VITE_API_ULTIMA_UBICACION}`, token: tokenSession }),
    enabled: logged,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  });

  useEffect(() => {

    const mapInstance = new maplibregl.Map({
      container: containerRef.current!,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [-99.1332, 19.4326],
      zoom: 12
    });

    mapInstance.on("load", async () => {

      setMap(mapInstance)

      const image = await mapInstance.loadImage(
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png"
      );

      mapInstance.addImage("cat", image.data);

      mapInstance.addSource("point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-99.1332, 19.4326]
              },
              properties: {}
            }
          ]
        }
      });

      mapInstance.addLayer({
        id: "points",
        type: "symbol",
        source: "point",
        layout: {
          "icon-image": "cat",
          "icon-size": 0.1,
          "icon-allow-overlap": true
        }
      });

    });

  }, []);
  // useEffect(() => {

  //   const mapInstance = new maplibregl.Map({
  //     container: containerRef.current!,
  //     style: "https://tiles.openfreemap.org/styles/bright",
  //     center: [-99.1332, 19.4326],
  //     zoom: 12
  //   })

  //   // console.log(mapInstance.getStyle())
  //   mapInstance.on('load', async () => {
  //     setMap(mapInstance)
  //     console.log(mapInstance.getStyle())
  //     const image = await mapInstance.loadImage('https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png');
  //     mapInstance.addImage('cat', image.data);
  //     mapInstance.addSource('point', {
  //       'type': 'geojson',
  //       'data': {
  //         'type': 'FeatureCollection',
  //         'features': [
  //           {
  //             'type': 'Feature',
  //             'geometry': {
  //               'type': 'Point',
  //               'coordinates': [-99.1332, 19.4326]
  //             },
  //             properties: {}
  //           }
  //         ]
  //       }
  //     });
  //     // mapInstance.addLayer({
  //     //   'id': 'points',
  //     //   'type': 'symbol',
  //     //   'source': 'point',
  //     //   layout: {
  //     //     "icon-image": "cat",
  //     //     "icon-size": 0.1,
  //     //     "icon-allow-overlap": true
  //     //   }
  //     // });
  //     mapInstance.addLayer({
  //       id: "debug",
  //       type: "circle",
  //       source: "point",
  //       paint: {
  //         "circle-radius": 10,
  //         "circle-color": "red"
  //       }
  //     });
  //   });
  // mapInstance.on("load", async () => {
  //   const icon = await mapInstance.loadImage(bus)
  //   // console.log(icon.data)
  //   mapInstance.addImage("vehicle-icon", icon.data)
  //    mapInstance.addSource('point', {
  //         type: 'geojson',
  //         data: {
  //             type: 'FeatureCollection',
  //             features: [
  //                 {
  //                     type: 'Feature',
  //                     geometry: {
  //                         type: 'Point',
  //                         coordinates: [-99.1332, 19.4326]
  //                     },
  //                     properties:{}
  //                 }
  //             ],
  //         }
  //     });
  //     mapInstance.addLayer({
  //         'id': 'points',
  //         'type': 'symbol',
  //         'source': 'point',
  //         'layout': {
  //             'icon-image': 'vehicle-icon',
  //             'icon-size': 0.25
  //         }
  //     });
  // })
  //  console.log(mapInstance.getStyle())

  // mapInstance.on("load", async () => {
  //   setMap(mapInstance)
  //   const icon = await mapInstance.loadImage(bus)
  //   console.log(" 1 tiene imagen?", mapInstance.hasImage("vehicle-icon"))
  //   mapInstance.addImage("vehicle-icon", icon.data)
  //   console.log("ahora tiene imagen?", mapInstance.hasImage("vehicle-icon"))
  //   mapInstance.addSource("vehicles", {
  //     type: "geojson",
  //     data: {
  //       type: "FeatureCollection",
  //       features: []
  //     }
  //   })

  //   mapInstance.addLayer({
  //     id: "vehicles-layer",
  //     type: "symbol",
  //     source: "vehicles",
  //     layout: {
  //       "icon-image": "vehicle-icon",
  //       "icon-size": 0.7,
  //       // "icon-rotate": ["get", "direccion"],
  //       // "icon-allow-overlap": true
  //     }
  //   })

  // })

// }, [])

//  useEffect(() => {
//   console.log("hay mapa?",!map)
//   if (!map || !data) return

//   const features = data.map((device: any) => ({
//     type: "Feature",
//     geometry: {
//       type: "Point",
//       coordinates: [
//         device.longitud,
//         device.latitud,
//       ]
//     },
//     properties: {
//       numeroSerie: device.numeroSerie,
//       nombre: device.nombre,
//       velocidad: device.velocidad,
//       direccion: device.direccion,
//       fecha_hora: device.fecha_hora,
//       numeroCanales: device.numeroCanales
//     }
//   }))

//   const source: any = map.getSource("vehicles")

//   if (source) {
//     source.setData({
//       type: "FeatureCollection",
//       features
//     })
//   }

// }, [data, map])

return (
  <MapContext.Provider value={{ map }}>
    <div ref={containerRef} style={{ height: "100vh" }} />
  </MapContext.Provider>
)
}