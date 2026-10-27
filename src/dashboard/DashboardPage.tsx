import { CardWithOneIndicator } from "./components/CardWithOneIndicator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowUp,
  faBus,
  faCircleDollarToSlot,
  faCircleExclamation,
  faClock,
  faClockRotateLeft,
  faFlagCheckered,
  faGaugeHigh,
  faPersonCircleCheck,
  faStopwatch,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons"
import { Card } from "primereact/card"
import { Chart } from "primereact/chart"
import { useEffect, useState } from "react"
import { MeterGroup } from "primereact/metergroup"
import { Knob } from "primereact/knob"
import { Odometro } from "../home/Odometro"


export const DashboardPage = () => {
  const [chartData, setChartData] = useState<any>({});
  const [chartMoneyData, setChartMoneyData] = useState<any>({});
  const [chartOptions, setChartOptions] = useState<any>({});
  const [chartMoneyOptions, setChartMoneyOptions] = useState<any>({});
  const [ocupation, setOcupation] = useState(89.56);
  const [kilometraje, setKilometraje] = useState(17793.23)
  useEffect(() => {
    const moneyData = {
      labels: [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo"
      ],
      datasets: [
        {
          data: [
            118450,
            112380,
            125960,
            121740,
            129880,
            134520,
            127610,
            131940,
            123890,
          ],
          tension: 0.4,
          borderColor: ['rgb(151, 229, 201)',],
          backgroundColor: ['rgb(121, 183, 160)',]
        }
      ],

    }
    const data = {
      labels: [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
        "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
      ],
      datasets: [
        {
          label: 'Pasajeros por Hora',
          data: [
            120, 95, 80, 70, 85, 180,
            820, 980, 1050, 860,
            520, 480, 460, 500,
            620, 740,
            980, 1120, 1080, 900,
            560, 410, 320, 260
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',

          ],
          borderWidth: 1,
          borderRadius: 5,
        }
      ]
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
    const moneyOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.raw;
              return ` $${value.toLocaleString("es-MX")} MXN`;
            }
          }
        },
        legend: {
          display: false
        }
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: {
        y: {
          ticks: {
            callback: (value: number) =>
              `$${value.toLocaleString("es-MX")}`
          },
          title: {
            display: true,
            text: "Ingresos (MXN)"
          }
        },
      }
    };

    setChartMoneyData(moneyData)
    setChartMoneyOptions(moneyOptions)
    setChartData(data);
    setChartOptions(options);
  }, []);
  const values = [
    { label: 'Operación', color: '#34d399', value: 90 },
    { label: 'Trámites Administrativos', color: '#ffd414', value: 1 },
    { label: 'Mantenimiento', color: '#fc941d', value: 8 },
    { label: 'Júridico', color: '#fa3232', value: 1 },
  ];
  return (
    <>
      <div className="my-3 md:flex w-10 mx-auto gap-3">
        <CardWithOneIndicator
          key={"unidadesEnRuta"}
          color={"purple"}
          icon={<FontAwesomeIcon icon={faBus} className="text-2xl" />}
          title="Unidades en Ruta"
          value={"90"}
          comparator={"+10%"}
          trendIcon={<i className="pi pi-arrow-up font-bold"></i>}
          trendSeverity={"green"}
        />
        <CardWithOneIndicator
          key={"pasajeros"}
          color={"cyan"}
          icon={<FontAwesomeIcon icon={faPersonCircleCheck} className="text-2xl" />}
          title="Pasajeros"
          value={"13,954"}
          comparator={"-3.16%"}
          trendIcon={<i className="pi pi-arrow-down font-bold"></i>}
          trendSeverity={"red"}
        />
        <CardWithOneIndicator
          key={"alertas"}
          color={"yellow"}
          icon={<FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl" />}
          title="Alertas"
          value={"16"}
          comparator={"-10%"}
          trendIcon={<i className="pi pi-arrow-down font-bold"></i>}
          trendSeverity={"green"}
        />
        <CardWithOneIndicator
          key={"recaudo"}
          color={"teal"}
          icon={<FontAwesomeIcon icon={faCircleDollarToSlot} className="text-2xl" />}
          title="Recaudo"
          value={"$132,567.50"}
          comparator={"+5.6%"}
          trendIcon={<i className="pi pi-arrow-up font-bold"></i>}
          trendSeverity={"green"}
        />
      </div>

      <div className="mb-3 md:flex w-10 mx-auto gap-3">
        <Card title="Operación" className="flex flex-column border-bottom-3 border-orange-200 hover:shadow-5">
          <div className="flex align-items-center mb-1">
            <FontAwesomeIcon
              icon={faClock}
              className="text-xs p-3 text-orange-900 border-round shadow-2 bg-orange-200"
            />
            <span className="mx-2 font-semibold">
              Frecuencia de Paso:
            </span>
            <span className="ml-auto">
              10 UT/hr
            </span>
          </div>
          <div className="flex align-items-center mb-1">
            <FontAwesomeIcon
              icon={faStopwatch}
              className="text-xs p-3 text-pink-900 border-round shadow-2 bg-pink-200"
            />
            <span className="mx-2 font-semibold" >
              Intervalo de Paso:
            </span>
            <span className="ml-auto">
              6:00 min
            </span>
          </div>
          <div className="flex align-items-center mb-1">
            <FontAwesomeIcon
              icon={faClockRotateLeft}
              className="text-xs p-3 text-purple-900 border-round shadow-2 bg-purple-200"
            />
            <span className="mx-2 font-semibold" >
              Tiempo de Vuelta:
            </span>
            <span className="ml-auto">
              80:00 min
            </span>
          </div>
          <div className="flex align-items-center mb-1">
            <FontAwesomeIcon
              icon={faFlagCheckered}
              className="text-xs p-3 text-gray-900 border-round shadow-2 bg-gray-200"
            />
            <span className="mx-2 font-semibold">
              Tiempo en Terminal:
            </span>
            <span className="ml-auto">
              15:30 min
            </span>
          </div>
          <div className="flex align-items-center">
            <FontAwesomeIcon
              icon={faGaugeHigh}
              className="text-xs p-3 text-cyan-900 border-round shadow-2 bg-cyan-200"
            />
            <span className="mx-2 font-semibold">
              Velocidad Comercial:
            </span>
            <span className="ml-auto">
              8.62 Km/hr
            </span>
          </div>
        </Card>
        <Card title="Recaudo" className="flex-1 border-bottom-3 border-teal-200 hover:shadow-5">
          <Chart type="line" data={chartMoneyData} options={chartMoneyOptions} />
        </Card>
        <Card title="Afluencia de Pasajeros" className="flex-1 border-bottom-3 border-pink-200 hover:shadow-5">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </Card>
      </div>





      <div className="mb-3 md:flex w-10 mx-auto gap-3">
        <Card title="Ocupación de Flota" className="flex-1 text-center hover:shadow-5">
          <Knob value={ocupation} onChange={(e) => setOcupation(e.value)} valueTemplate={'{value}%'} size={120} readOnly valueColor="var(--teal-400)" rangeColor="#70809069" strokeWidth={5} className="flex justify-content-center" />
          <span className="text-green-500 text-center">
            +5.6% <FontAwesomeIcon icon={faArrowUp} className="ml-1" />
          </span>
        </Card>
        <Card title="Kilometraje" className="flex-1 text-center hover:shadow-5">
          <Odometro />
        </Card>
        <Card title="Disponibilidad de Flota" className="flex flex-1 justify-content-center hover:shadow-5">
          <MeterGroup className="flex-1" values={values} labelPosition="start" labelOrientation="vertical" />
        </Card>

        <Card title="Mantenimiento" className="flex flex-1 flex-column text-center hover:shadow-5">

          <div className="flex align-items-center gap-3 mt-2">

            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-l p-3 text-pink-900 border-round shadow-2 bg-pink-200"
            />
            <span className="text-s text-left text-pink-500">
              Mantenimientos preventivos pendientes
            </span>
            <span className="text-xl font-bold">
              6
            </span>
          </div>
          <div className="flex align-items-center gap-3 mt-2">

            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-l p-3 text-pink-900 border-round shadow-2 bg-pink-200"
            />
            <span className="text-s text-left text-pink-500">
              Unidades con desgaste crítico de neumáticos
            </span>
            <span className="text-xl font-bold">
              2
            </span>
          </div>
        </Card>
      </div>

    </>
  )
}

