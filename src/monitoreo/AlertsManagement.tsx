import { Dialog } from "primereact/dialog"
import { AlertsForm } from "./components/AlertsForm"
import { useRef, useState } from "react";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { InputTextarea } from "primereact/inputtextarea";

export const AlertsManagement = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [estatusSelected, setEstatusSelected] = useState<any>(undefined);
  const [buttonProperties, setButtonProperties] = useState<any>(undefined);
  const [comment, setComment] = useState<string | undefined>(undefined);

  const stepperRef = useRef(null);

  const footerContent = (
    <div>
      {/* <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus /> */}
    </div>
  );


  const estatusOptions = [
    { name: "No Procedente", code: 0, buttonLabel: "Terminar", icon: "pi pi-check", nextStep: 2 },
    { name: "Procedente", code: 1, buttonLabel: "Siguiente", icon: "pi pi-arrow-right", nextStep: 1 },

  ]

  const onStatusSelect = (e: any) => {
    const estatus = e.value
    setEstatusSelected(estatus)
    setButtonProperties(estatus)
    if (estatus.code == 0) {
    }
  }

  return (
    <div className="px-2 pt-2">
      <AlertsForm />
      <Dialog
        header="Manejo de Alarma"
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => { if (!visible) return; setVisible(false); }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        blockScroll
        footer={footerContent}
      >
        <div className="flex gap-2 align-items-center">
          <span>
            Empresa:
          </span>
          <span className="font-bold">
            CODIVERSA
          </span>
          <Tag className="text-bluegray-900" severity="warning" value="Pendiente"></Tag>
        </div>

        <div className="flex gap-2">
          <span>
            Unidad:
          </span>
          <span className="font-bold">
            CODI-063
          </span>
        </div>

        <div className="flex gap-2">
          <span>
            Tipo de Alarma:
          </span>
          <span className="font-bold">
            ALARMA DE ALTA VELOCIDAD
          </span>
        </div>

        <div className="flex gap-2">
          <span>
            Fecha y Hora:
          </span>
          <span className="font-bold">
            21/4/2026, 5:20:29 p.m.
          </span>
        </div>

        <div className="flex gap-2">
          <span>
            Velocidad:
          </span>
          <span className="font-bold">
            10 Km/Hr
          </span>
        </div>

        <div className="flex gap-2">
          <span>
            Ubicación:
          </span>
          <span className='cursor-pointer text-blue-700 hover:text-blue-400 text-sm'>
            {"[19.421483, -99.176358]"}
          </span>
        </div>

        <div className="flex gap-2">
          <span>
            Dirección:
          </span>
          <span className="font-bold">
            10°
          </span>
        </div>
        <div className="card flex justify-content-center">
          <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }} linear activeStep={activeStep} >
            <StepperPanel header="Evaluación de Alarma">
              <div className="flex">
                <FloatLabel className="w-full">
                  <Dropdown className="w-full" inputId="estatus" options={estatusOptions} optionLabel="name" value={estatusSelected} onChange={onStatusSelect} />
                  <label htmlFor="estatus">Seleccione una opción</label>
                </FloatLabel>
              </div>
              {buttonProperties?.code == 0 && <div className="card flex ">
                <FloatLabel className="mt-4 w-full">
                  <InputTextarea id="description" className="w-full" value={comment} onChange={(e) => setComment(e.target.value)} rows={5} cols={60} />
                  <label htmlFor="description">Comentarios</label>
                </FloatLabel>
              </div>}
              <div className="flex pt-4 justify-content-end">
                {buttonProperties?.code == 0 && <Button label="Terminar" icon="pi pi-check" iconPos="right" onClick={() => { if (!visible) return; setVisible(false); }} />}
                {buttonProperties?.code == 1 && <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />}


              </div>

            </StepperPanel>
            <StepperPanel header="Generar Evidencia">
              <div className="flex flex-column h-12rem">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                  Content II
                </div>
              </div>
              <div className="flex pt-4 justify-content-between">
                <Button label="Regresar" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
              </div>
            </StepperPanel>
            <StepperPanel header="Generar Reporte">
              <div className="flex flex-column h-12rem">
                <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
              </div>
              <div className="flex pt-4 justify-content-start">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
              </div>
            </StepperPanel>
          </Stepper>
        </div>

      </Dialog>
    </div>
  )
}

