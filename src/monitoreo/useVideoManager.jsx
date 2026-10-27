import { useState, useRef } from "react";
import axios from "axios";

export const useVideoManager = () => {
  const [videos, setVideos] = useState([]);
  const ports = useRef({});
  const portQueue = useRef([]);
  

  // Inicializar puertos 
  const initPorts = (portList) => {
    portList.forEach((p) => {
      ports.current[p] = 0;
    });
  };

  // Obtener puerto disponible (máx 4 por puerto)
  const getAvailablePort = () => {
    for (let p in ports.current) {
      if (ports.current[p] < 4) {
        ports.current[p]++;
        portQueue.current.push(p);
        return p;
      }
    }
    return null;
  };

  // Liberar puerto
  const releasePort = (port) => {
    if (ports.current[port] > 0) {
      ports.current[port]--;
    }
  };

  // Agregar video
  const addVideo = async (deviceNo, channel, title, deviceType) => {
    const port = getAvailablePort();

    if (!port) {
      alert("No hay puertos disponibles");
      return;
    }
    try {
      const url = `http://186.96.54.45:12056/api/v1/basic/live/video?key=ytU2t%2FveJMrC3l789lXvsKW2fE%2FIAyBeZTAXTifEXWyy1jvYKtXkUZtzs%2F%2FOjv3MRfkVc%2F5nuwBVDYC%2F&terid=${deviceNo}&chl=${channel}&audio=1&st=0&port=${port}`
      const res = await axios.get(url);
      console.log(res)

      if (res.status == 200 ) {
        setVideos((prev) => [
          ...prev,
          {
            id: Date.now(),
            url: res.data.data.url,
            title,
            port,
            channel,
            terid: deviceNo
          }
        ]);

        // log igual que antes
        // await axios.post("/common/add/optlog", {
        //   terid: deviceNo,
        //   logContent: `Open Video - channel: ${channel}`,
        //   command: "opt-401"
        // });
      }
    } catch (err) {
      console.error("Error abriendo video", err);
      releasePort(port);
    }
  };

  const removeVideo = async (id) => {
    const video = videos.find((v) => v.id === id);
    if (!video) return;

    releasePort(video.port);

    setVideos((prev) => prev.filter((v) => v.id !== id));

    await axios.post("/common/add/optlog", {
      terid: video.terid,
      logContent: `Close Video - channel: ${video.channel}`,
      command: "opt-401"
    });
  };

  return {
    videos,
    addVideo,
    removeVideo,
    initPorts
  };
}