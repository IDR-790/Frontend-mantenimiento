import { faBell, faBus, faDrawPolygon, faRoute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "primereact/badge";
import { Menubar } from "primereact/menubar";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tree, TreeCheckboxSelectionKeys, TreeCheckboxSelectionKeyType } from "primereact/tree";
import { classNames } from "primereact/utils";
import { useContext, useEffect, useRef, useState } from "react";
import { Dispositivo, Empresa, GeneralContext } from "../../shared/GeneralContext";
import { TreeNode } from "primereact/treenode";
import { AuthContext } from "../../auth/context/AuthContext";
import { useFetch } from "../../shared/hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface PersonalizedTreeNode extends TreeNode {
  tipo?: "empresa" | "autobus";
  children?: PersonalizedTreeNode[]
}


export const MapToolbar = ({ 
  setVisibleRight,
  selectedBuses, 
  onSelectionBuses,
  alertsCount,
  setAlertsCount
}:{ 
  setVisibleRight: (e: any) => void; 
  selectedBuses: TreeCheckboxSelectionKeys | null;
  onSelectionBuses: (e: any) => void;
  alertsCount: number;
  setAlertsCount: (e: any) => void;
 }) => {

  const { empresas, dispositivos } = useContext(GeneralContext);
  const overlayBusesRef = useRef<OverlayPanel | null>(null);
  const overlayRoutesRef = useRef<OverlayPanel | null>(null);
  const overlayGeofencesRef = useRef<OverlayPanel | null>(null);

  const [buses, setBuses] = useState<TreeNode[] | undefined>(undefined);
  const [routes, setRoutes] = useState<TreeNode[] | undefined>(undefined);
  const [geofences, setGeoFences] = useState<TreeNode[] | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<TreeCheckboxSelectionKeys | null>(null);

  useEffect(() => {
    const { treeData } = generarTree(dispositivos, empresas)
    // setSelectedKeys(selectedNodes)
    setBuses(treeData)
  }, [empresas || dispositivos])

  useEffect(() => {

  }, [selectedKeys])


  const dataGeofences = [
    {
      key: 'codiversa',
      label: 'CODIVERSA',
      children: [
        {
          key: 'PATIO_BOMBAS',
          label: 'PATIO BOMBAS',
          icon: <FontAwesomeIcon icon={faDrawPolygon} className="mr-1" />,
        },
        {
          key: 'TERMINAL CHAPULTEPEC',
          label: 'TERMINAL CHAPULTEPEC',
          icon: <FontAwesomeIcon icon={faDrawPolygon} className="mr-1" />,
        },
        {
          key: 'TERMINAL SAUZALES',
          label: 'TERMINAL SAUZALES',
          icon: <FontAwesomeIcon icon={faDrawPolygon} className="mr-1" />,
        },
        {
          key: 'TERMINAL_PREPA_5',
          label: 'TERMINAL PREPA 5',
          icon: <FontAwesomeIcon icon={faDrawPolygon} className="mr-1" />,
        }
      ]
    },
    {
      key: 'copesa',
      label: 'COPESA',
      children: [
        {
          key: 'COPE-001',
          label: 'COPE-001',
          icon: <FontAwesomeIcon icon={faBus} className="mr-1" />,
        },
        {
          key: 'COPE-002',
          label: 'COPE-002',
          icon: <FontAwesomeIcon icon={faBus} className="mr-1" />,
        },
        {
          key: 'COPE-003',
          label: 'COPE-003',
          icon: <FontAwesomeIcon icon={faBus} className="mr-1" />,
        },
        {
          key: 'COPE-004',
          label: 'COPE-004',
          icon: <FontAwesomeIcon icon={faBus} className="mr-1" />,
        },
        {
          key: 'COPE-005',
          label: 'COPE-005',
          icon: <FontAwesomeIcon icon={faBus} className="mr-1" />,
        },
      ]
    },

  ];
  const dataRoutes = [
    {
      key: 'codiversa',
      label: 'CODIVERSA',
      children: [
        {
          key: '24-A',
          label: '24-A',
          icon: <FontAwesomeIcon icon={faRoute} className="mr-1" />,
        },
        {
          key: '24-B',
          label: '24-B',
          icon: <FontAwesomeIcon icon={faRoute} className="mr-1" />,
        },
        {
          key: '24-C',
          label: '24-C',
          icon: <FontAwesomeIcon icon={faRoute} className="mr-1" />,
        },
        {
          key: '24-D',
          label: '24-D',
          icon: <FontAwesomeIcon icon={faRoute} className="mr-1" />,
        }
      ]
    },
    {
      key: 'copesa',
      label: 'COPESA',
      children: [
        {
          key: '1-A',
          label: '1-A',
          icon: <FontAwesomeIcon icon={faRoute} className="mr-1" />,
        },
        {
          key: '1-B',
          label: '1-B',
          icon: <FontAwesomeIcon icon={faRoute} className="mr-1" />,
        },
        {
          key: '1-C',
          label: '1-C',
          icon: <FontAwesomeIcon icon={faRoute} className="mr-1" />,
        },
      ]
    },

  ];

  const itemRenderer = (item: any) => (
    <a className="flex align-items-center p-menuitem-link p-2">
      {item.icon}
      <span className="mr-2">{item.label}</span>
      {!!item.badge && <Badge className="ml-auto" value={item.badge} severity={"danger"} />}
    </a>
  );


  useEffect(() => {
    setRoutes(dataRoutes)
    setGeoFences(dataGeofences)
  }, [])

  const items = [
    {
      label: 'Unidades',
      icon: <FontAwesomeIcon icon={faBus} className="mr-2" />,
      items: [],
      command: (event: any) => {
        overlayGeofencesRef.current?.hide();
        overlayRoutesRef.current?.hide();
        overlayBusesRef.current?.toggle(event.originalEvent);
      }
    },
    {
      label: 'Rutas',
      icon: <FontAwesomeIcon icon={faRoute} className="mr-2" />,
      items: [],
      command: (event: any) => {
        overlayBusesRef.current?.hide();
        overlayGeofencesRef.current?.hide()
        overlayRoutesRef.current?.toggle(event.originalEvent);
      },
      // Quitar cuando se agregue la funcionalidad de las rutas
      disabled: true
    },
    {
      label: 'Geocercas',
      icon: <FontAwesomeIcon icon={faDrawPolygon} className="mr-2" />,
      className: "active",
      items: [],
      command: (event: any) => {
        overlayBusesRef.current?.hide();
        overlayRoutesRef.current?.hide();
        overlayGeofencesRef.current?.toggle(event.originalEvent);
      },
      // Quitar cuando se agregue la funcionalidad de las geocercas
      disabled: true
    },
    {
      label: 'Alertas',
      icon: <FontAwesomeIcon icon={faBell} className="mr-2" />,
      badge: alertsCount,
      command: (event: any) => {
        setVisibleRight((prev: boolean) => !prev)
        // console.log(event)
      },
      template: itemRenderer
    },

  ];
  const togglerTemplate = (node: any, options: any) => {
    if (!node) {
      return;
    }

    const expanded = options.expanded;
    const iconClassName = classNames('p-tree-toggler-icon pi pi-fw', {
      'pi-plus-circle': !expanded,
      'pi-minus-circle': expanded
    });

    return (
      <button type="button" className="p-tree-toggler p-link" tabIndex={-1} onClick={options.onClick}>
        <span className={iconClassName} aria-hidden="true"></span>
      </button>
    );
  };
  const dataTable = [
    { "numeroSerie": "007102237E", "nombre": "REVO-005", "empresa": 4 },
    { "numeroSerie": "00710214A4", "nombre": "REVO-007", "empresa": 4 },
    { "numeroSerie": "00710220B0", "nombre": "REVO-021", "empresa": 4 },
    { "numeroSerie": "00710214C6", "nombre": "REVO-048", "empresa": 4 },
    { "numeroSerie": "007102246E", "nombre": "REVO-054", "empresa": 4 },
    { "numeroSerie": "0071021691", "nombre": "REVO-065", "empresa": 4 },
    { "numeroSerie": "00710214D2", "nombre": "REVO-067", "empresa": 4 },
    { "numeroSerie": "0071021677", "nombre": "REVO-071", "empresa": 4 }]

  const bodyTemplate = (rowData: any) => {
    return (
      <div className="flex align-items-center gap-2">
        <img alt={rowData.nombre} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
        <span className="pi pi-times"></span>
        <span>{rowData.nombre}</span>
      </div>
    );
  };
  return (
    <div className="map-toolbar">
      <Menubar model={items} />
      <OverlayPanel ref={overlayBusesRef}
      showCloseIcon
      >
        <div style={{ width: '300px', maxHeight: '70vh', overflowY: 'auto' }} >

          <Tree
            value={buses}
            selectionMode="checkbox"
            selectionKeys={selectedBuses}
            onSelectionChange={(e: any) => {
              onSelectionBuses(e)
            }}
            filter
            filterMode="strict"
            filterPlaceholder="Buscar"
            className="border-0 p-0"
            contentClassName="p-0"
            togglerTemplate={togglerTemplate}
            emptyMessage={"No hay Unidades Disponibles"}
          />
        </div>
      </OverlayPanel>
      <OverlayPanel ref={overlayRoutesRef}
      >
        <div style={{ width: '300px', maxHeight: '70vh', overflowY: 'auto' }} >
          <Tree
            value={routes}
            selectionMode="checkbox"
            selectionKeys={selectedKeys}
            onSelectionChange={(e: any) => {
              setSelectedKeys(e.value)
              // console.log(e.value)
            }}
            className="border-0 p-0"
            contentClassName="p-0"
            togglerTemplate={togglerTemplate}
            emptyMessage={"No hay Rutas Disponibles"}
          />
        </div>
      </OverlayPanel>
      <OverlayPanel ref={overlayGeofencesRef}
      >
        <div style={{ width: '300px', maxHeight: '70vh', overflowY: 'auto' }} >
          <Tree
            value={geofences}
            selectionMode="checkbox"
            selectionKeys={selectedKeys}
            onSelectionChange={(e: any) => {
              setSelectedKeys(e.value)
              // console.log(e.value)
            }}
            className="border-0 p-0"
            contentClassName="p-0"
            togglerTemplate={togglerTemplate}
            emptyMessage={"No hay Geocercas Disponibles"}
          />
        </div>
      </OverlayPanel>
    </div>
  )
};

export function generarTree(
  dispositivos: Dispositivo[],
  empresas: Empresa[]
): { treeData: TreeNode[] } {

  const tree: Record<number, PersonalizedTreeNode> = {}
  // crear nodos de empresa
  empresas.forEach((emp: Empresa) => {
    const key = emp.nombre.toLowerCase()

    tree[emp.idEmpresa] = {
      key,
      label: emp.nombre,
      tipo: "empresa",
      children: []
    }
  })


  // recorrer dispositivos una sola vez
  dispositivos.forEach((d: Dispositivo) => {

    const empresaNode = tree[d.empresa]

    if (!empresaNode) return
    const key = d.numeroSerie
    empresaNode.children!.push({
      key,
      label: d.nombre,
      icon: <FontAwesomeIcon icon={faBus} className="mr-1 text-purple-500" />,
      tipo: "autobus",
      data: d
    })
  })

  const treeData = Object.values(tree).filter(e => e.children!.length > 0)

  return { treeData }
}
