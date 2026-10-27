import { createContext } from "react"
import maplibregl from "maplibre-gl"

export const MapContext = createContext<{
  map: maplibregl.Map | null
}>({
  map: null
})