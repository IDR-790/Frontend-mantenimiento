import { useQuery } from "@tanstack/react-query";
import { useFetch } from "../shared/hooks/useFetch";
import { AuthContext } from "../auth/context/AuthContext";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet"
import L, { latLng, map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapToolbar } from "./components/MapToolBar";
import { PersonalizedPopup } from "./components/PersonalizedPopup";
import io from "socket.io-client";
import MarkerClusterGroup from "react-leaflet-cluster";
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
import { VideoPanel } from "./components/VideoPanel";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { TreeNode } from "primereact/treenode";
import { Dispositivo, Empresa, GeneralContext } from "../shared/GeneralContext";
import { LiveAlertsPanel } from "./components/LiveAlertsPanel";


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
  empresa: string;
}

export interface Alert {
  nombre: string;
  idEmpresa: number;
  empresa: string;
  velocidad: number;
  direccion: number;
  latitud: number;
  longitud: number;
  fechaHoraTransmision: string;
  idAlertaDispositivo: number;
  idTipoAlerta: number;
  idDispositivo: number;
  serieDispositivo: string;
  descripcion: string;
  altitud: number;
  origen: string;
  vista?: boolean;
}


export const LiveMap = () => {
  const terIds = [
    '00C40038AE', '007100C250', '007100B427', '007100C2F6', '007100C187',
    '007100BA15', '007100C138', '007100C2E7', '007100B9CD', '007100C283',
    '007100B39F', '007102281E', '007100C160', '007100C26D', '007100C2AA',
    '00710223BD', '007100C313', '007100C230', '007100C275', '007100C252',
    '007100C17D', '007100C268', '007100C27A', '007100C2A2', '007100C2EF',
    '007100BA3A', '00710226C8', '007100B3B9', '007100C349', '007100C273',
    '007100B38E', '007100C137', '007100B9DE', '0071000D75', '007100B994',
    '007100C2F4', '0071000D64', '007100C0FD', '007100C191', '007100C253',
    '007100C192', '0071022ACD', '007100C347', '007100B983', '007100C26C',
    '007100C271', '007100C3A6', '007100C20B', '007100C193', '007100C18A',
    '0071000D5D', '0071022B3C', '0071000D22', '007100C21E', '007100C32A',
    '007100B398', '0071021F79', '0071022234', '00710227E0', '0071022C93',
    '0071025142', '0071021F9E', '00710227DA', '00710227CF', '0071022D17',
    '0071025140', '0071022124', '0071022AA3', '0071022B84', '00710223CC',
    '00710226D6', '00710226CB', '00710225D8', '0071022226', '007100B9E3',
    '007102257E', '007102243F', '00710222FD', '00710222FB', '007102244B',
    '0071022634', '00710222F7', '00710223BF', '0071022AD3', '00710224E7',
    '007102237E', '00710214A4', '00710220B0', '00710214C6', '007102246E',
    '0071021691', '00710214D2', '0071021677', '007102508D', '007100C2A8',
    '00E40045FC', '007102239A', '00E4004631', '007100B9E0', '00E4006B5C',
    '0071022AD5', '00710220B4', '0071022768', '00710223D5', '007102229A',
    '0071022381', '00E40060D5', '00E40060D2', '007102285A', '00E4006B2F',
    '00E4006B4E', '00E4006B44', '0071022B3D', '00E4006B5A', '00E4006B55',
    '00E4006AAD', '00E4004609', '00E4006B57', '007102277B', '00E4006AA9',
    '00E4006B33', '00E4006B0A', '00E4006B59', '00E4006B04', '00E4006AFE',
    '00710215E2', '00E4006B4D', '007102162A', '00710225D1', '00E4006B4A',
    '007102224B', '00710223B5', '0071021804', '00E400462E', '00E4004610',
    '00E400460F', '00E4006B50', '00E4006ACC', '00E4004633', '00E4004628',
    '00710224CF', '00710226C6', '00E4006B51', '00E4006AFB', '00E4006B08',
    '00E4006B4B', '00E4006B46', '0071022AAB', '00E4006B30', '00E4006B58',
    '00710223BB', '00E4006AB6', '00E4006B49', '00710223A9', '00E4006B4F',
    '00E4006B43', '00710226BE', '007102162E', '007102240E', '00710224D7',
    '0071022B31', '0071022472', 'NONAME', '00D2019BD7', '00E4006026',
    '00C40038AC', '00E4006B56', '007102261D', '0071022461', '0071022400',
    '00710226D1', '00710227CE', '00710224C9', '0071022763', '0071022534',
    '00710223B3', '0071022468', '0071022415', '00710222EA', '0071022776',
    '0071022A9D', '0071022B25', '0071022426', '00710223B4', '0071021682',
    '0071022B42', '0071022B2B', '0071022438', '0071022A97', '0071022405',
    '0071022AA9', '00710217D1', '0071022AD1', '00710227D1', '0071021615',
    '0071022428', '00710223B6', '00710217C2', '00710223B2', '007102230E',
    '00710217CD', '007102222E', '0071022597', '0071022466', '0071021387',
    '00710226D7', '00710223A8', '0071022B23', '007102259C', '00710217A2',
    '007102261E', '0071022459', '00710225DC', '007102179C', '0071022AAC',
    '0071022C8B', '0071022701', '0071022765', '00710214C3', '007102268A',
    '0071022C88', '0071022301', '0071021FED', '0071022B34', '007102200E',
    '0071022AA6', '00710226B4', '0071022702', '0071022B21', '007102244C',
    '0071022442', '007102221F', '0071022CBE', '0071022B1F', '0071022420',
    '0071021476', '0071022B06', '0071022B40', '0071000BC8', '007102246B',
    '0071022456', '00710217A1', '0071022462', '00710217A0', '0071022406',
    '00710217AB', '0071022ACE', '00710223A5', '0071022ABE', '007102179A',
    '0071021798', '0071021625', '0071022569', '00710225DA', '0071022090',
    '007102233D', '0071022749', '0071022514', '0071022762', '00710224D2',
    '0071021448', '00710226F9', '00710217A5', '0071021F75', '0071021629',
    '00710222E6', '0071022693', '0071022B1E', '0071022545', '00710217D4',
    '00710226CD', '00710223BA', '0071022B01', '0071021835', '0071022019',
    '0071022271', '007102231A', '007102246A', '007102228E', '007102231D',
    '0071022368', '0071022AB9', '00710223C1', '007100C0E1', '0071021F51',
    '0071022AD0', '0071022302', '0071022AB0', '00710226B8', '0071022AAA',
    '0071022224', '00710226D3', '00710226AC', '007102281C', '0071022B16',
    '0071022375', '007102242E', '007102244E', '0071022402', '0071022143',
    '0071022471', '00710226B3', '007102163F', '00710226B0', '0071022AC4',
    '0071022532', '007102245D'
  ]

  const fetch = useFetch();
  const { tokenSession, logged } = useContext(AuthContext);
  const { empresas, dispositivos } = useContext(GeneralContext);
  const mapRef = useRef<L.Map | null>(null);
  const [devices, setDevices] = useState<Record<string, Vehicle>>({});
  const [selectedBuses, setSelectedBuses] = useState<TreeCheckboxSelectionKeys>(generarSelectedBuses(dispositivos, empresas));
  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const [visibleVideo, setVisibleVideo] = useState<boolean>(false);
  const [iconSize, setIconSize] = useState<number>(50)
  const [autoCenter, setAutoCenter] = useState<boolean>(true);
  const [alertsCount, setAlertsCount] = useState<number>(0);
  const [alerts, setAlerts] = useState<Alert[] | []>([]);
  const socketRef = useRef<any>(null);



  const { data, status } = useQuery({
    queryKey: ["ultima-ubicacion"],
    queryFn: () => fetch.getRequest({ url: `${import.meta.env.VITE_API_ULTIMA_UBICACION}`, token: tokenSession }),
    enabled: logged,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  });
  // const { data:estado, status:estadoStatus } = useQuery({
  //   queryKey: ["estado"],
  //   queryFn: () => fetch.postRequest({ url: `http://186.96.54.45:12056/api/v1/basic/state/now`, token: tokenSession, json:{
  //     key: "ytU2t%2FveJMrC3l789lXvsKW2fE7IACZeZTAXTynEW2Oy1jvYKtXkUZtzs%2F8VpYVAzGacpKOaTWOnIYVS",
  //     terid: []
  //   } }),
  //   enabled: logged,

  // });

  // Llenar devices a partir de objects (solo una vez)
  useEffect(() => {
    const mapDevices: Record<string, Vehicle> = {};
    if (!data) return
    data.forEach((el: Vehicle) => {
      mapDevices[el.numeroSerie] = el;
    });
    // console.log(mapDevices)
    setDevices(mapDevices);
  }, [data]);


  useEffect(() => {

    if (socketRef.current) return;
    socketRef.current = io(`${import.meta.env.VITE_SOCKET_URL}`, {
      auth: {
        token: tokenSession,
      },
      transports: ["websocket"],
    });
    socketRef.current.on("realtime:ready", (info: any) => {
      console.log("socket listo", info);
    });

    socketRef.current.on("gps", (gps: Vehicle) => {
      // console.log("gps", gps);
      setAutoCenter(false)
      setDevices(prev => ({
        ...prev,
        [gps.numeroSerie]: gps
      }));
    });

    socketRef.current.on("alertas", (alert: Alert) => {
      console.log("alertas", alert);
      setAlerts(prev => {
        const updated = [alert, ...prev];
        return updated.slice(0, 200);
      });
      setAlertsCount(prev => {
        const newCount = prev + 1
        return newCount > 200 ? 200 : newCount
      });
    });
    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };

  }, [tokenSession])

  const filteredDevices = useMemo(() => {

    const selectedIds = Object.keys(selectedBuses!);
    const filtered = Object.fromEntries(
      Object.entries(devices).filter(([id]) => selectedIds.includes(id))
    );
    // console.log(filtered)
    return filtered;
  }, [devices, selectedBuses]);

  const coords = useMemo<[number, number][]>(() => {
    return Object.keys(filteredDevices).map(id => {
      const dev = filteredDevices[id];
      return [dev.latitud, dev.longitud];
    });
  }, [filteredDevices]);

  const onSelectionBuses = (e: any) => {
    // console.log(Object.entries(devices))
    // console.log(Object.keys(e.value))
    setAutoCenter(true)
    setSelectedBuses(e.value)
  }
  // console.log(selectedBuses)

  return (
    <div className="relative">
      <MapToolbar
        setVisibleRight={setVisibleRight}
        selectedBuses={selectedBuses}
        onSelectionBuses={onSelectionBuses}
        alertsCount={alertsCount}
        setAlertsCount={setAlertsCount}

      />
      <MapContainer
        ref={mapRef}
        zoom={12}
        center={[19.425, -99.165]}
        maxZoom={18}
        scrollWheelZoom={true}
        preferCanvas={true}
        minZoom={9}
      >
        <TileLayer
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {
          Object.keys(filteredDevices).map((numSerie: string) => {
            const device = filteredDevices[numSerie];

            return (
              <Marker
                key={numSerie}
                position={[device.latitud, device.longitud]}
                icon={getIcon(device.direccion, iconSize)}
              >
                <PersonalizedPopup
                  deviceName={device.nombre}
                  company={device.empresa}
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
                <Tooltip direction="bottom" offset={[0, 10]} opacity={1} permanent >
                  <b>
                    {device.nombre}
                  </b>
                </Tooltip>
              </Marker>
            );
          })
        }

        <MapAutoCenter coords={coords} autoCenter={autoCenter} />

      </MapContainer>
      <VideoPanel
        visibleVideo={visibleVideo}
        setVisibleVideo={setVisibleVideo}
        channels={4}
        urls={[
          "http://186.96.54.45:12060/live.flv?devid=0071021677&chl=3&st=1&audio=1&svrip=127.0.0.1&svrport=17891&token=jYZs9f%2FCJYDGlRH99lajs6Ssf07QCCZGYEicCGvkga6lbrUIxNKdZUc%3D",
          "http://186.96.54.45:12060/live.flv?devid=0071021677&chl=1&st=1&audio=1&svrip=127.0.0.1&svrport=17891&token=jYZs9f%2FCJYDGlRH%2F9lajs6Ssf07QCCZGYFgbST5gUGBiVxOaRlSOZsE%3D",
          "http://186.96.54.45:12060/live.flv?devid=0071021677&chl=2&st=1&audio=1&svrip=127.0.0.1&svrport=17891&token=jYZs9f%2FCJYDGlRH89lajs6Ssf07QCCZGYEDfqMEm6UnG8mZBhZGU5IQ%3D",
          "http://186.96.54.45:12060/live.flv?devid=0071021677&chl=3&st=1&audio=1&svrip=127.0.0.1&svrport=17891&token=jYZs9f%2FCJYDGlRH99lajs6Ssf07QCCZGYEicCGvkga6lbrUIxNKdZUc%3D"
        ]} />

      <LiveAlertsPanel visible={visibleRight} setVisibleRight={setVisibleRight} alerts={alerts} setAlerts={setAlerts} setAlertsCount={setAlertsCount} />

    </div>
  )
}

function convertDirectionToIcon(angle: number): number {

  const normalized = Math.floor(angle) % 360;

  return Math.floor((normalized + 22) / 45) % 8;

}
function getIcon(direccion: number, iconSize: number) {
  return new L.Icon({
    iconUrl: `/icons/${convertDirectionToIcon(direccion)}.png`,
    iconSize: [iconSize, iconSize],
  });
}

function MapAutoCenter({ coords, autoCenter }: { coords: [number, number][]; autoCenter: boolean }) {

  const map = useMap();

  useEffect(() => {
    if (!autoCenter) return;
    if (!coords || coords.length === 0) return;
    if (!map) return;
    if (coords.length === 1) {

      map.setView(
        [coords[0][0], coords[0][1]],
        15
      );

      return;
    }

    const bounds = L.latLngBounds(coords);

    map.flyToBounds(bounds, {
      duration: 1
    });
    // console.log(map)

  }, [coords, autoCenter]);

  return null;
};

// function MapAutoCenter({
//   coords,
//   autoCenter,
// }: {
//   coords: [number, number][];
//   autoCenter: boolean;
// }) {
//   const map = useMap();
//   const [isReady, setIsReady] = useState(false);

//   // 🔹 Esperar a que Leaflet termine de inicializar el mapa
//   useEffect(() => {
//     map.whenReady(() => {
//       setIsReady(true);
//     });
//   }, [map]);

//   useEffect(() => {
//     if (!isReady) return;
//     if (!autoCenter) return;
//     if (!coords || coords.length === 0) return;

//     // 🔹 Filtrar coordenadas inválidas (muy importante en tiempo real)
//     const validCoords = coords.filter(
//       ([lat, lng]) =>
//         lat !== null &&
//         lng !== null &&
//         !isNaN(lat) &&
//         !isNaN(lng) &&
//         lat !== 0 &&
//         lng !== 0
//     );

//     if (validCoords.length === 0) return;

//     // 🔹 Si solo hay un vehículo → centrar directo
//     if (validCoords.length === 1) {
//       map.setView(validCoords[0], 15, {
//         animate: true,
//       });
//       return;
//     }

//     // 🔹 Múltiples vehículos → calcular bounds
//     const bounds = L.latLngBounds(validCoords);

//     // 🔹 Evitar animaciones pesadas si hay muchos puntos
//     if (validCoords.length > 50) {
//       map.fitBounds(bounds, { padding: [50, 50] });
//     } else {
//       map.flyToBounds(bounds, {
//         padding: [50, 50],
//         duration: 1,
//       });
//     }
//   }, [coords, autoCenter, isReady, map]);

//   return null;
// }

function LocationMarker({ setIconSize }: any) {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    zoom() {
      const zoom = map.getZoom()
      // if (zoom > 11) {
      //   setIconSize(50)
      // } else {
      //   setIconSize(30)
      // }
      console.log(map.getZoom())
    },
    // locationfound(e) {
    //   setPosition(e.latlng)
    //   map.flyTo(e.latlng, map.getZoom())
    // },
  })

  return null
}
function generarSelectedBuses(
  dispositivos: Dispositivo[],
  empresas: Empresa[]
): TreeCheckboxSelectionKeys {

  const selectedNodes: TreeCheckboxSelectionKeys = {}

  // crear nodos de empresa
  empresas.forEach(emp => {
    const key = emp.nombre.toLowerCase()
    if (key == "insitra") return
    selectedNodes[key] = {
      checked: true,
      partialChecked: false
    }

  })


  // recorrer dispositivos una sola vez
  dispositivos.forEach(d => {

    const key = d.numeroSerie
    selectedNodes[key] = {
      checked: true,
      partialChecked: false
    }
  })
  return selectedNodes
}


