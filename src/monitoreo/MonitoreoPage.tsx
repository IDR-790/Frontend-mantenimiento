import React, { useEffect, useRef, useState } from "react";
import { GlobalesPage } from "./catalogos/globales/GlobalesPage";
import { NavBar } from "../shared/components/menus/NavBar";
import { MenuItem, MySidebar } from "../shared/components/menus/MySidebar";
import { InfonavitPage } from "./infonavit/InfonavitPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faClock, faCompass, faCopy, faGaugeHigh, faIndent, faLocationArrow, faLocationDot, faMapLocationDot, faMobileScreen, faPersonArrowUpFromLine, faRoad } from "@fortawesome/free-solid-svg-icons";
import { ConstruccionScreen } from "../shared/components/screens/Construccion";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, FeatureGroup } from "react-leaflet";
import '@geoman-io/leaflet-geoman-free'
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import mqtt from 'mqtt';
const velocimetro = new URL('/velocimetro.png', import.meta.url).href;
const insitraLogo = new URL('../assets/images/insitra-logo.png', import.meta.url).href;
import io from "socket.io-client";
import { terIds } from "./terid";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { Badge } from "primereact/badge";
import { Sidebar } from "primereact/sidebar";
import { Messages } from "primereact/messages";
import { SplitButton } from "primereact/splitbutton";
import { ButtonGroup } from 'primereact/buttongroup';
import { FlvPlayer } from "./FlvPlayer";
import VideoGrid from "./VideoGrid";
import { useVideoManager } from "./useVideoManager";
import { useQuery } from "@tanstack/react-query";
import { ProgressBar } from "primereact/progressbar";
import { ProgressSpinner } from "primereact/progressspinner";

interface GpsData {
  deviceno: string,
  lat: string,
  lng: string,
  state: number,
  speed: number,
  direction: number,
  altitude: number,
  dateTime: string,
  carlicense: string,
  groupName: string,
  message?: string,
  errorcode?: number
}


export const MonitoreoPage = () => {

  const [component, setComponent] = useState<JSX.Element | JSX.Element[]>();
  const [devices, setDevices] = useState<Record<string, GpsData>>({});
  const apiKey = `${import.meta.env.VITE_FLESPI_TOKEN}`

  useEffect(() => {


    const socket = io("http://186.96.54.45:12056", {
      reconnection: true,
      transports: ["polling"],
    });

    socket.on("connect", () => {
      console.log("✅ Conectado al socket:", socket.id);

      // socket.emit("sub_gps", {
      //   key: 'ytU2t%2FveJMrC3l789lXvsKW2fE%2FIACVeZTAXTy%2FEXWKy1jvYKtXkUZtzs%2F92njeTQ7ny1k2k2TL2wBYA',
      //   didArray: terIds,
      // });
      // socket.emit("sub_pflow", {
      //   key: 'ytU2t%2FveJMrC3l789lXvsKW2fE%2FIACVeZTAXTy%2FEXWKy1jvYKtXkUZtzs%2F92njeTQ7ny1k2k2TL2wBYA',
      //   didArray: terIds,
      // });
      // socket.emit("sub_mileage", {
      //   key: 'ytU2t%2FveJMrC3l789lXvsKW2fE%2FIACVeZTAXTy%2FEXWKy1jvYKtXkUZtzs%2F92njeTQ7ny1k2k2TL2wBYA',
      //   didArray: terIds,
      // });
      // socket.emit("sub_state", {
      //   key: 'ytU2t%2FveJMrC3l789lXvsKW2fE%2FIACVeZTAXTy%2FEXWKy1jvYKtXkUZtzs%2F92njeTQ7ny1k2k2TL2wBYA',
      //   didArray: terIds,
      // });
      // socket.emit("sub_gds", {
      //   key: 'ytU2t%2FveJMrC3l789lXvsKW2fE%2FIACVeZTAXTy%2FEXWKy1jvYKtXkUZtzs%2F92njeTQ7ny1k2k2TL2wBYA',
      //   didArray: terIds,
      // });
      socket.emit("sub_alarm", {
        key: 'ytU2t%2FveJMrC3l789lXvsKW2fE%2FIACVeZTAXTy%2FEXWKy1jvYKtXkUZtzs%2F92njeTQ7ny1k2k2TL2wBYA',
        didArray: terIds,
        alarmType:[]
      });
      // socket.emit("sub_acc", {
      //   key: 'ytU2t%2FveJMrC3l789lXvsKW2fE%2FIACVeZTAXTy%2FEXWKy1jvYKtXkUZtzs%2F92njeTQ7ny1k2k2TL2wBYA',
      //   didArray: terIds,
      // });
    });

    // socket.on("sub_alarm", (data) => {
    //   console.log("📡 sub_alarm:", data);


    // });
    // socket.on("sub_gps", (data: GpsData) => {
    //   // console.log("📡 sub_gps:", data);
    //   if (!data.errorcode) {
    //     setDevices(prev => ({
    //       ...prev,
    //       [data.deviceno]: data
    //     }));

    //   }

    // });
    socket.on("sub_pflow", (data) => {
      console.log("sub_pflow:", data);

    });
    socket.on("sub_mileage", (data) => {
      console.log("sub_mileage:", data);

    });
    socket.on("sub_state", (data) => {
      console.log("sub_state:", data);
    });
    socket.on("sub_gds", (data) => {
      console.log("sub_gds:", data);
    });
    socket.on("sub_gps", (data) => {
      console.log("sub_gps:", data);
    });
    socket.on("sub_alarm", (data) => {
      console.log("sub_alarm:", data);
    });
    socket.on("sub_acc", (data) => {
      console.log("sub_acc:", data);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Desconectado:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("🚨 Error de conexión:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [])

  const items: MenuItem[] = [
    {
      id: "Menú Principal",
      label: "Menú Principal",
      icon: <FontAwesomeIcon key={"map"} icon={faMapLocationDot} className="mr-1" />,
      items: [
        {
          id: "Lista de Autobuses",
          label: "Lista de Autobuses",
          // icon: 'pi pi-globe',
          command: (e) => setComponent(<ConstruccionScreen />),
        },
        {
          id: "Rutas",
          label: "Rutas",
          // icon: 'pi pi-globe',
          command: (e) => setComponent(<ConstruccionScreen />),
        },
      ],
    },

  ];
  const featureGroupRef = useRef<L.FeatureGroup>(null)
  const [tempGeometry, setTempGeometry] = useState<any>(null)
  const handleCreated = (e: any) => {
    const layer = e.layer
    const geojson = layer.toGeoJSON()

    console.log("Nueva geocerca:", geojson)

    setTempGeometry(geojson.geometry)
    // Aquí después abriremos modal
  }
  const [visibleRight, setVisibleRight] = useState<boolean>(false)
  const [visibleVideo, setVisibleVideo] = useState<boolean>(false)
  const [markerTooltipText, setMarkerTooltipText] = useState<String>("045")
  const msgs = useRef<Messages>(null);
  const { videos, addVideo, removeVideo, initPorts } = useVideoManager();
  useEffect(() => {
    initPorts([12060, 12061, 12062, 12063]);
  }, []);
  const videoUrl = "http://186.96.54.45:12060/live.flv?devid=00C40038AE&chl=1&st=0&audio=1&svrip=127.0.0.1&svrport=17891&token=jYYY8P%2FAJ46w5xH%2F9lejs6SsfUTTAyBKZ4p%2Blq2rmLffIvCt3ktmQFM%3D"
  return (
    <>
      {/* <MapContainer center={[22.875621, -102.540082]} zoom={6} scrollWheelZoom={true}> */}
      <MapContainer center={[19.425, -99.165]} zoom={16} scrollWheelZoom={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {/* {
            Object.keys(devices).map(device => {
              const dev = devices[device];
              return (
                <Marker
                  key={dev.deviceno}
                  position={[
                    parseFloat(dev.lat) || 19.440885,
                    parseFloat(dev.lng) || -99.161779
                  ]}
                >
                  <Popup>
                    <div className="">
                      <b>Empresa:</b> {dev.groupName}
                      <br />
                      <b>Autobús:</b> {dev.carlicense}
                      <br />
                      <b>Id:</b> {dev.deviceno}
                      <br />
                      <b>Velocidad:</b> {dev.speed}
                      <br />
                      <b>Altitud:</b> {dev.altitude}
                      <br />
                      <b>Latitud:</b> {dev.lat}
                      <br />
                      <b>Longitud:</b> {dev.lng}
                      <br />
                      <b>Hora Última Ubicación:</b> {new Date(dev.dateTime).toLocaleString("es-MX")}
                    </div>

                  </Popup>
                  <Tooltip>
                    Eco:
                    <b>
                      {dev.carlicense}
                    </b>
                  </Tooltip>
                </Marker>
              );
            })
          } */}
        <Marker
          key={"213123234"}
          position={[19.432, -99.220]}
          eventHandlers={{
            mouseover: () => {
              setMarkerTooltipText("CODI-045")
              console.log("mouseover")
            },
            mouseout: () => {
              setMarkerTooltipText("045")
            }
          }}>
          <Popup>
            <div className="flex flex-column">
              <span className="text-xl font-bold">CODI-045</span>
              <span className="font-bold">CODIVERSA</span>
            </div>
            <hr />
            <div className="flex flex-column gap-2">

              <div className="w-full text-center">
                <div className="flex align-items-center">
                  <FontAwesomeIcon
                    icon={faGaugeHigh}
                    className={`text-xs p-2 text-${"green"}-900 border-round shadow-2 bg-${"green"}-200`}
                  />
                  <span className="mx-2 font-semibold">
                    Velocidad:
                  </span>
                  <span className="ml-auto">
                    53 Km/hr
                  </span>
                </div>
              </div>
              <div className="w-full text-center">
                <div className="flex align-items-center">
                  <FontAwesomeIcon
                    icon={faLocationArrow}
                    className="text-xs p-2 text-green-900 border-round shadow-2 bg-green-200"
                  />
                  <span className="mx-2 font-semibold">
                    Dirección:
                  </span>
                  <span className="ml-auto">
                    Suroeste
                  </span>
                </div>
              </div>
              <div className="w-full text-center">
                <div className="flex align-items-center">
                  <FontAwesomeIcon
                    icon={faPersonArrowUpFromLine}
                    className="text-xs p-2 text-green-900 border-round shadow-2 bg-green-200"
                  />
                  <span className="mx-2 font-semibold">
                    Ocupación:
                  </span>
                  <span className="ml-auto">
                    30 %
                  </span>
                </div>
              </div>
              <div className="w-full text-center">
                <div className="flex align-items-center">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-xs p-2 text-green-900 border-round shadow-2 bg-green-200"
                  />
                  <span className="mx-2 font-semibold">
                    Ubicación:
                  </span>
                  <div className="flex flex-column ml-auto text-right">
                    <span>
                      19.232
                    </span>
                    <span>
                      -99.644
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex align-items-center">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-xs p-2 text-green-900 border-round shadow-2 bg-green-200"
                />
                <span className="ml-1 text-right">
                  18:12:00 p.m. 23/2/2025
                </span>
              </div>
            </div>


            {/* <div className="p-card">
                      <b>Empresa:</b> CODIVERSA
                      <br />
                      <b>Autobús:</b> CODI-045
                      <br />
                      <b>Id:</b> 00DF9851ESF
                      <br />
                      <b>Velocidad:</b> 20 Km/Hr
                      <br />
                      <b>Altitud:</b> 2265
                      <br />
                      <b>Latitud:</b> 19.432
                      <br />
                      <b>Longitud:</b> -99.220
                      <br />
                      <b>Hora Última Ubicación:</b> hace 5 segundos
                      <br />
                      <b>Dirección: </b> hace 5 segundos
                      <br />
                      <b>Pasajeros a Bordo: </b> 30
                      <br />
                      <b>Ocupación: </b> 50%
                    </div> */}
            <div className="mt-2 flex justify-content-center gap-2 ">

              <Button icon="pi pi-video" severity="info" size="small" tooltip="Abrir Video" onClick={() => {
                // addVideo("00C40038AE", 1, "prueba", "")
                setVisibleVideo(true);
              }} >
                <Badge value={"4"} severity="info"></Badge>
              </Button>
              <Button icon="pi pi-bell" severity="danger" size="small" tooltip="Detalle de Alarmas" onClick={() => setVisibleRight(true)} >
                <Badge value="8" severity="danger"></Badge>
              </Button>

            </div>
          </Popup>
          {/* <Tooltip direction="top" offset={[-15, -10]}>
              CODI-045
            </Tooltip> */}
          <Tooltip direction="top" offset={[-15, -10]} opacity={1} permanent>
            {markerTooltipText}
          </Tooltip>

        </Marker>
        <Marker
          key={"213123456"}
          position={[19.437, -99.212]}
        >
          <Tooltip direction="top">
            <div className="">
              <b>Empresa:</b> CODIVERSA
              <br />
              <b>Autobús:</b> CODI-045
              <br />
              <b>Id:</b> 00DF9851ESF
              <br />
              <b>Velocidad:</b> 20 Km/Hr
              <br />
              <b>Altitud:</b> 2265
              <br />
              <b>Latitud:</b> 19.432
              <br />
              <b>Longitud:</b> -99.220
              <br />
              <b>Hora Última Ubicación:</b> hace 5 segundos
              <br />
              <b>Dirección: </b> hace 5 segundos
              <br />
              <b>Pasajeros a Bordo: </b> 30
              <br />
              <b>Ocupación: </b> 50%
            </div>
          </Tooltip>
        </Marker>
        <Marker
          key={"213123"}
          position={[19.430, -99.225]} />

        <GeomanLayer />

      </MapContainer>
      <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)} dismissable={false} modal={false} header={<><h2>CODI-045</h2> <p>CODIVERSA</p></>}>
        <span><b>Pasajeros a Bordo: </b> 30</span>
      </Sidebar>

      <Sidebar
        visible={visibleVideo}
        position="right"
        onHide={() => setVisibleVideo(false)}
        dismissable={false}
        modal={false}
        header={<><h2>CODI-045</h2> <p>CODIVERSA</p></>}
        style={{ height: "70%", width: "50%" }}
      >
        <div className="flex flex-column h-full gap-2 text-white">

          <div className="flex flex-1 gap-2">
            <div className="bg-gray-900 flex-1 flex flex-column">
              <span>
                CH1
              </span>
              <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".7s" className="h-full" />
              {/* <FlvPlayer url={"http://186.96.54.45:12060/live.flv?devid=00C40038AE&chl=1&st=0&audio=1&svrip=127.0.0.1&svrport=17891&token=jYYY8P%2FAJ46w5xH%2F9lejs6Ssfk3WByBMYXu9J1jH1kX651lhZYaGpNQ%3D"} /> */}
            </div>
            <div className="bg-gray-900 flex-1 flex flex-column">
              <span>
                CH2
              </span>
              <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".7s" className="h-full" />

              {/* <FlvPlayer url={"http://186.96.54.45:12060/live.flv?devid=00C40038AE&chl=2&st=0&audio=1&svrip=127.0.0.1&svrport=17891&token=jYYY8P%2FAJ46w5xH%2F9lejs6Ssfk3WByBMYXu9J1jH1kX651lhZYaGpNQ%3D"} /> */}
            </div>
          </div>

          <div className="flex gap-2 flex-1">
            <div className="bg-gray-900 flex-1 flex flex-column">
              <span>
                CH3
              </span>
              <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".7s" className="h-full" />

              {/* <FlvPlayer url={"http://186.96.54.45:12060/live.flv?devid=00C40038AE&chl=3&st=0&audio=1&svrip=127.0.0.1&svrport=17891&token=jYYY8P%2FAJ46w5xH%2F9lejs6Ssfk3WByBMYXu9J1jH1kX651lhZYaGpNQ%3D"} /> */}
            </div>
            <div className="bg-gray-900 flex-1 flex flex-column">
              <span>
                CH4
              </span>
              <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".7s" className="h-full" />

              {/* <FlvPlayer url={"http://186.96.54.45:12060/live.flv?devid=00C40038AE&chl=4&st=0&audio=1&svrip=127.0.0.1&svrport=17891&token=jYYY8P%2FAJ46w5xH%2F9lejs6Ssfk3WByBMYXu9J1jH1kX651lhZYaGpNQ%3D"} /> */}
            </div>
          </div>

        </div>

      </Sidebar>
    </>
  );
};

const mockGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: 1, nombre: "Patio Norte", tipo: "geocerca" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-99.18, 19.43],
          [-99.17, 19.43],
          [-99.17, 19.42],
          [-99.18, 19.42],
          [-99.18, 19.43]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { id: 2, nombre: "Ruta 1", tipo: "ruta" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-99.19, 19.44],
          [-99.16, 19.41]
        ]
      }
    },
    {
      type: "Feature",
      properties: { id: 3, nombre: "Unidad 101", tipo: "unidad" },
      geometry: {
        type: "Point",
        coordinates: [-99.165, 19.425]
      }
    }
  ]
}
function GeomanLayer() {
  const map = useMap()

  useEffect(() => {

    // 🔥 Agregar controles Geoman
    map.pm.setLang("es");
    map.pm.setGlobalOptions({ exitModeOnEscape: true });
    map.pm.setPathOptions({
      color: "purple",
      fillColor: "purple",
      fillOpacity: 0.5,
    });
    map.pm.addControls({
      position: "topleft", oneBlock: true
    })

    // 🔥 Cargar geometrías del "backend"
    const layerGroup = L.geoJSON(mockGeoJSON, {
      style: (feature: any) => {
        switch (feature.properties.tipo) {
          case "geocerca":
            return { color: "red", weight: 2 }
          case "ruta":
            return { color: "blue", weight: 4 }
          default:
            return { color: "green" }
        }
      },
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng)
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`
          <strong>${feature.properties.nombre}</strong><br/>
          Tipo: ${feature.properties.tipo}
        `)

        // 🔥 Hacer editable cada capa
        layer.pm.enable()
      }
    }).addTo(map)

    // 🔥 Eventos Geoman
    const handleCreate = (e: any) => {
      console.log('Geocerca creada:', e.layer.toGeoJSON())
      console.log('Geocerca creada:', e)
    }
    const handleEdit = (e: any) => {
      console.log('Geocerca editada:', e)
      // console.log('Geocerca editada:', e)
      e.layers.eachLayer((layer: any) => {
        console.log("Capa editada:", layer.toGeoJSON())
      })
    }
    const handleRemove = (e: any) => {
      console.log('Geocerca creada:', e.layer.toGeoJSON())
    }

    map.on('pm:create', handleCreate)

    map.on("pm:edit", handleEdit)

    map.on("pm:remove", handleRemove)
    map.on("pm:update", handleEdit)
    map.on("pm:lasso-select", (e:any) => {console.log(e)})

    return () => {
      map.removeLayer(layerGroup)
      map.pm.removeControls()
      map.off('pm:create', handleCreate)
      map.off('pm:edit', handleEdit)
      map.off('pm:remove', handleRemove)
    }

  }, [map])

  return null
}
