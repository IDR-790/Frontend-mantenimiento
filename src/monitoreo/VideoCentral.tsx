import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VideoCentralToolbar } from "./components/VideoCentralToolbar";
import { faClapperboard } from "@fortawesome/free-solid-svg-icons";

export const VideoCentral = () => {
  return (

    <div className="px-2 pt-2">
      <VideoCentralToolbar />
      <div
        id="videoPlayer"
        className="flex flex-column justify-content-center align-items-center gap-3"
        style={{ height: "80vh", backgroundColor: "black", color: "white" }}
      >
        <FontAwesomeIcon icon={faClapperboard} style={{ fontSize: "3rem" }} />
        SELECCIONA UNA UNIDAD, PARA REPRODUCIR Y DESCARGAR EL VIDEO
      </div>
    </div>
  )
}

