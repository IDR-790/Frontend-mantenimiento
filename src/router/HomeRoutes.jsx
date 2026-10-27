import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../home/HomePage";
import { MonitoreoPage } from "../monitoreo/MonitoreoPage";
import Map from "../monitoreo/Map";
import {MapView} from "../monitoreo/MapProvider/MapView";

export const HomeRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/monitoreo" element={<MapView />} />
        <Route path="/monitoreo" element={<MonitoreoPage />} /> */}
        <Route path="/*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
};
