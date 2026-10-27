import { Sidebar } from 'primereact/sidebar'
import React from 'react'
import { Alert } from '../LiveMap';
import { AlertCard } from './AlertCard';
import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export const LiveAlertsPanel = ({
  visible = false,
  setVisibleRight,
  alerts = [],
  setAlerts,
  setAlertsCount
}: {
  visible: boolean;
  setVisibleRight: (e: any) => void;
  alerts: Alert[]
  setAlerts: (e: any) => void;
  setAlertsCount: (e: any) => void;
}) => {

  const handleDeleteAlert = (indexAlert: number) => {
    setAlerts((prev: Alert[]) => prev.filter((_, index) => index != indexAlert));
    setAlertsCount((prev: number) => prev - 1);
  }

  const handleManageAlert = (alert: Alert) => {
    console.log(alert.toString())
  }

  return (
    <Sidebar
      visible={visible}
      onHide={() => setVisibleRight(false)}
      position='right'
      header={<h2>Alertas</h2>}
    >
      <div className="flex mb-2 flex-end gap-1 align-items-center">
        <Button 
          className="flex gap-1 align-items-center" 
          size={"small"} 
          onClick={(e: any) => {
            setAlerts([])
            setAlertsCount(0)
            }} 
          severity="danger" >
          Limpiar Todo
          <FontAwesomeIcon icon={faTrashCan} />
        </Button>
      </div>
      <div className='flex flex-column gap-1'>
        {
          alerts.map((alert: Alert, index: number) => {
            return (
              <AlertCard
                key={alert.idAlertaDispositivo}
                index={index}
                alert={alert}
                handleDeleteAlert={handleDeleteAlert}
                handleManageAlert={handleManageAlert}
              />
            )
          })
        }
      </div>
    </Sidebar>
  )
}