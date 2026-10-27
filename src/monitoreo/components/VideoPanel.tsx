import { ProgressSpinner } from "primereact/progressspinner"
import { Sidebar } from "primereact/sidebar"
import { useState } from "react";
import { FlvPlayer } from "../FlvPlayer";

export const VideoPanel = ({
  visibleVideo,
  setVisibleVideo,
  channels,
  urls
}: {
  visibleVideo: boolean;
  setVisibleVideo: (e: any) => void,
  channels: number,
  urls: string[]
}) => {
  const [successVideo, setSuccessVideo] = useState<boolean>(false)
  const [loadingVideo, setLoadingVideo] = useState<boolean>(false)
  return (
    <Sidebar
      visible={visibleVideo}
      position="right"
      onHide={() => setVisibleVideo(false)}
      dismissable={false}
      modal={false}
      header={<div className="flex flex-column"><span className="font-bold text-2xl">CODI-045</span> <span>CODIVERSA</span></div>}
      style={{ height: "70%", width: "50%" }}
    >
      <div className="grid text-white h-full">

        {
          Array.from({ length: channels },(_, index) => {
            const label = `CH${index+1}`
            return (
              
                <div key={label} className="col-6 bg-gray-900 flex flex-column border-2 border-round">
                  <span>
                    {label}
                  </span>
                  {loadingVideo ? <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".7s" className="h-full" />
                  :<FlvPlayer
                      url={urls[index]} 
                      setSuccessVideo={setSuccessVideo}
                      setLoadingVideo={setLoadingVideo} 
                      />
                    }
                  { !successVideo && <span className="text-red-500 text-center">ERROR AL CARGAR VIDEO</span> }
                </div>
            
            )
          })

        }
   

      </div>

    </Sidebar>
  )
}