import { useContext, useEffect, useState } from "react";
import { Dispositivo, Empresa, GeneralContext } from "../../shared/GeneralContext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { addLocale } from "primereact/api";
import { Button } from "primereact/button";

export interface BusOptions {
  key: string;
  label: string;
  value: string;
}

export interface BusGroupedOptions {
  key: string;
  label: string;
  code: number;
  items: BusOptions[];

}

export const VideoCentralToolbar = () => {
  const now = new Date()
  now.setMinutes(new Date().getMinutes() + 1)

  const { empresas, dispositivos } = useContext(GeneralContext);
  const [buses, setBuses] = useState<BusGroupedOptions[] | undefined>(undefined);
  const [bus, setBus] = useState<BusGroupedOptions | undefined>(undefined);
  const [startTime, setStartTime] = useState<Nullable<Date>>(new Date());
  const [endTime, setEndTime] = useState<Nullable<Date>>(now);
  const [loading, setLoading] = useState<boolean>(false);

  addLocale('es', {
    firstDayOfWeek: 1,
    showMonthAfterYear: true,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  useEffect(() => {
    const { optionsBuses } = generarOptions(dispositivos, empresas)
    setBuses(optionsBuses)
  }, [empresas || dispositivos])

  const onSelectionBus = (e: any) => {
    setBus(e.value)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      bus,
      startTime,
      endTime
    }
    console.log(data)
  }

  return (
    <div>
      <div
        className="flex px-2 py-4 w-full gap-3 bg-gray-100"
      >
        <FloatLabel
          className="w-2"
        >
          <Dropdown
            inputId="unidad"
            filter
            value={bus}
            onChange={onSelectionBus}
            options={buses}
            optionLabel="label"
            optionGroupLabel="label"
            optionGroupChildren="items"
            className="w-full"
            required
          />
          <label style={{ color: "black" }} htmlFor="unidad">Selecione una Unidad</label>
        </FloatLabel>
        <FloatLabel
          className="w-2"
        >
          <Calendar
            inputId="fechaInicial"
            value={startTime}
            onChange={(e) => setStartTime(e.value)}
            locale="es"
            dateFormat="dd/mm/yy"
            className="w-full"
            mask="99/99/9999 99:99:99"
            required
            showTime
            showSeconds
          />
          <label style={{ color: "black" }} htmlFor="fechaInicial">Selecione Fecha Inicial</label>
        </FloatLabel>
        <FloatLabel
          className="w-2"
        >
          <Calendar
            inputId="fechaFinal"
            value={endTime}
            onChange={(e) => setEndTime(e.value)}
            locale="es"
            dateFormat="dd/mm/yy"
            mask="99/99/9999 99:99:99"
            className="w-full"
            required
            showTime
            showSeconds
          />
          <label style={{ color: "black" }} htmlFor="fechaFinal">Selecione Fecha Final</label>
        </FloatLabel>
        {/* <FloatLabel
          className="w-2"
        >
          <Calendar
            inputId="horaInicio"
            value={startTime}
            onChange={(e) => setStartTime(e.value)}
            hideOnRangeSelection
            locale="es"
            dateFormat="dd/mm/yy"
            className="w-full"
            showTime
            timeOnly
            
            mask="99:99"
            required
          />
          <label style={{ color: "black" }} htmlFor="horaInicio">Hora Inicial</label>
        </FloatLabel>
        <FloatLabel
          className="w-2"
        >
          <Calendar
            inputId="horaFin"
            value={endTime}
            onChange={(e) => setEndTime(e.value)}
            hideOnRangeSelection
            locale="es"
            dateFormat="dd/mm/yy"
            className="w-full"
            showTime
            timeOnly
            hourFormat="24"
            mask="99:99"
            required
          />
          <label style={{ color: "black" }} htmlFor="horaFin">Hora Final</label>
        </FloatLabel> */}
        <Button

          icon="pi pi-search"
          loading={loading}
          severity="info"
          rounded
          type="submit"
          tooltip="Buscar"
          tooltipOptions={{ position: 'left', mouseTrack: true }}
          onClick={handleSubmit}
        />
        <Button
          icon="pi pi-download"
          disabled={!loading}
          // loading={loading}
          severity="help"
          rounded
          type="submit"
          tooltip="Descargar"
          tooltipOptions={{ position: 'left', mouseTrack: true }}
          onClick={() => console.log("descargar")}
        />
      </div>
    </div>
  )
}

export const generarOptions = (dispositivos: Dispositivo[], empresas: Empresa[]): { optionsBuses: BusGroupedOptions[] } => {
  const optionsBuses: BusGroupedOptions[] = []

  // Crear grupos de dispositivos
  empresas.forEach((emp: Empresa, index: number) => {
    const key = emp.nombre.toLowerCase()
    optionsBuses[index] = {
      key,
      label: emp.nombre,
      code: emp.idEmpresa,
      items: []
    }
  })

  // Añadir dispositivo a cada uno de sus grupos
  dispositivos.forEach((d: Dispositivo) => {

    const empresaGrupo = optionsBuses.findIndex((empresa: BusGroupedOptions) => empresa.code == d.empresa)
    if (empresaGrupo == -1) return
    const key = d.numeroSerie
    optionsBuses[empresaGrupo].items.push({
      key,
      label: d.nombre,
      value: d.numeroSerie
    })
  })
  console.log(optionsBuses)

  return { optionsBuses }
}
