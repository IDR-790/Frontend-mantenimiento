import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet"
import L, { latLng, map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { MapToolbar } from "./components/MapToolBar";
import { VideoPanel } from "./components/VideoPanel";
import { PersonalizedPopup } from "./components/PersonalizedPopup";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { AlertCard } from "./components/AlertCard";
import "./styles/mapToolBar.css"
import "./styles/alertsContainer.css"
import { useQuery } from "@tanstack/react-query";
import { useFetch } from "../shared/hooks/useFetch";
import { AuthContext } from "../auth/context/AuthContext";
import { Vehicle, VehiclesLayer } from "./components/VehicleLayer";
import io from "socket.io-client";

export const MonitoringPage = () => {

  const fetch = useFetch();
  const mapRef = useRef<L.Map | null>(null);
  const vehiclesLayerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const [visibleVideo, setVisibleVideo] = useState<boolean>(false);
  const { tokenSession, logged } = useContext(AuthContext);

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
    if (!mapRef.current) return;
    vehiclesLayerRef.current = L.layerGroup().addTo(mapRef.current);
  }, []);

  const icons = useMemo(() => {

    const list: L.Icon[] = [];

    for (let i = 0; i < 8; i++) {
      list.push(
        new L.Icon({
          iconUrl: `/icons/${i}.png`,
          iconSize: [80, 80],
          iconAnchor: [30, 30]
        })
      );
    }

    return list;

  }, []);

  const convertDirectionToIcon = (angle: number): number => {

    const normalized = Math.floor(angle) % 360;

    return Math.floor((normalized + 22) / 45) % 8;

  }
  const getIcon = (direccion: number) => {
    return icons[convertDirectionToIcon(direccion)];
  };


  useEffect(() => {

    if (!data || !vehiclesLayerRef.current) return;

    data.forEach((device: Vehicle) => {

      if (markersRef.current.has(device.numeroSerie)) return;

      const marker = L.marker(
        [device.latitud, device.longitud],
        {
          icon: getIcon(device.direccion),
          riseOnHover: true
        }
      );

      marker.bindTooltip(device.nombre, {
        direction: "top",
        offset: [0, -10],
        opacity: 0.9
      });

      marker.addTo(vehiclesLayerRef.current!);

      markersRef.current.set(device.numeroSerie, marker);

    });
    return (() => {
      vehiclesLayerRef.current?.clearLayers();
      markersRef.current.clear();
    })

  }, [data]);

  useEffect(() => {
    const socket = io("http://192.168.1.154:3000", {
      auth: {
        token: tokenSession,
      },
      transports: ["websocket"],
    });
    socket.on("realtime:ready", (info) => {
      // console.log("socket listo", info);
    });

    socket.on("gps", (data: Vehicle) => {
      // console.log(markersRef)
      const marker = markersRef.current.get(data.numeroSerie);
      console.log("ubicación", data);
      // console.log("marcador", marker);

      if (!marker) return;

      marker.setLatLng([
        Number(data.latitud),
        Number(data.longitud)
      ]);
    });
    return () => {
      socket.disconnect();
    };

  }, [tokenSession])
  //  const coords = useMemo(() => {
  //       return Object.keys(filteredDevices).map(id => {
  //           const dev = filteredDevices[id];
  //           return [dev.latitud, dev.longitud];
  //       });
  //   }, [filteredDevices]);




  return (
    <div className="relative">

      <MapToolbar setVisibleRight={setVisibleRight} />
      <MapContainer
        ref={mapRef}
        center={[19.425, -99.165]}
        zoom={12}
        scrollWheelZoom={true}
        preferCanvas={true}
      >
        <TileLayer
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {data && <MapAutoCenter devices={data} />}
        <VehiclesLayer
          data={data}
          markersRef={markersRef}
          setVisibleVideo={setVisibleVideo}
        />


      </MapContainer>

      {/* <div className="alerts-container">
            Alerts
      </div> */}



      <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)} dismissable={false} modal={false} className="w-25rem" header={<><h2 className="p-0">Alertas</h2></>}>
        <div className="flex mb-2 flex-end gap-1 align-items-center">
          <Button className="flex gap-1 align-items-center " size={"small"} onClick={(e: any) => console.log("Limpiar Todo")} severity="danger" >
            Limpiar Todo
            <FontAwesomeIcon icon={faTrashCan} />
          </Button>
        </div>
        <div className="flex flex-column gap-1">
          <AlertCard
            deviceName={"CODI-045"}
            company={"CODIVERSA"}
            speed={"53"}
            direction={"Norte"}
            latitude={"19.232"}
            longitude={"-99.644"}
            timestamp={"2026-02-27 05:00:17"}
            alertType="Exceso de velocidad"
          />
        </div>
      </Sidebar>

      <VideoPanel
        visibleVideo={visibleVideo}
        setVisibleVideo={setVisibleVideo}
        channels={4}
        urls={[
          "http://186.96.54.45:12060/live.flv?devid=00C40038AE&chl=1&st=0&audio=1&svrip=127.0.0.1&svrport=17891&token=jYYY8P%2FAJ46w5xH%2F9lejs6SsfkzRBSRIbD2Oyr0W1KLIEpJCah5goyc%3D",
          "http://186.96.54.45:12060/live.flv?devid=00C40038AE&chl=2&st=0&audio=1&svrip=127.0.0.1&svrport=17891&token=jYYY8P%2FAJ46w5xH89lejs6SsfkzRBSRGZ48fJc9jIm3QAb5kolTevCg%3D",
          "http://186.96.54.45:12060/live.flv?devid=00C40038AE&chl=3&st=0&audio=1&svrip=127.0.0.1&svrport=17891&token=jYYY8P%2FAJ46w5xH99lejs6SsfkzRBSRHYxINA2T7OMUpLxa68Xq3l3M%3D",
          "http://186.96.54.45:12060/live.flv?devid=00C40038AE&chl=4&st=0&audio=1&svrip=127.0.0.1&svrport=17891&token=jYYY8P%2FAJ46w5xH69lejs6SsfkzRBSVObVsS6GQQE6BmvDTWWJfRWy0%3D"
        ]} />

    </div>
  )
}


export const MapAutoCenter = ({ devices }: { devices: Vehicle[] }) => {

  const map = useMap();

  useEffect(() => {

    if (!devices || devices.length === 0) return;

    if (devices.length === 1) {

      map.setView(
        [devices[0].latitud, devices[0].longitud],
        15
      );

      return;
    }

    const bounds = L.latLngBounds(
      devices.map(d => [d.latitud, d.longitud])
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 16
    });

  }, [devices, map]);

  return null;
};

