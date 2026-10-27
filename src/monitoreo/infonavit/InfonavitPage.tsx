import React, { useEffect, useState } from 'react'
import { TablaCRUD } from '../../shared/components/tablas/TablaCRUD'
import { FormMaker } from '../../shared/components/forms/FormMaker'
import infonavit_altas from '../db/infonavit.json'
import trabajadores from '../db/trabajadores.json'
import periodos from '../db/periodos.json'

export const InfonavitPage = () => {
    const [dataTable, setDataTable] = useState<any[]>([])
    const [showForm1, setShowForm1] = useState(true)
    const [showForm2, setShowForm2] = useState(false)

    useEffect(() => {
        setDataTable(infonavit_altas.map(i => ({...i, id: i.cred})))
    }, [])
    

    const searchCred = (cred, form) => {
        if(!cred) return
        debounce( () => {
            const dataTrab = trabajadores.find( trab => trab.cred==cred ) 
            setTrabData(dataTrab, form)
        }, 500 )
        
    }

    const setTrabData = (data, form) => {
        const { nombre, rfc, adscripcion } = data
        const { numero, fecha_inicio, fecha_final } = periodos[19]
        form.setValue( 'nombre', nombre )
        form.setValue( 'rfc', rfc )
        form.setValue( 'adscripcion', adscripcion )
        form.setValue( 'periodo', numero )
        form.setValue( 'fecha_ini', fecha_inicio )
        form.setValue( 'fecha_fin', fecha_final )
    }

    const setPeriodo = (form) => {
        const { numero, fecha_inicio, fecha_final } = periodos[19]
        
        setTimeout(() => {
            form.setValue( 'periodo2', numero )
            form.setValue( 'fecha_ini2', fecha_inicio )
            form.setValue( 'fecha_fin2', fecha_final )
        }, 500);
    }

    return (
    <>
        <h1 className='bg-purple-300 m-0 p-3'>Infonavit</h1>
        <div className='mx-auto p-3' style={{ width: '64rem' }}>
            <div className='mx-auto my-3'>
                <h2 onClick={() => setShowForm2(prev => !prev)}
                    className='bg-gray-200 w-full m-0 p-2 border-round-md flex-center justify-content-between cursor-pointer'
                >
                    Cuota Bimestral
                    <i className={`pi pi-${showForm2 ? 'minus' : 'plus'}-circle`} />
                </h2>
                {showForm2 ?
                    <div className='bg-gray-100 pb-3 flex-center gap-3 row-gap-5 p-3'>
                        <div className='m-0 p-3 bg-red-100 text-red-700'>
                            <span className='capitalize text-xl font-semibold block mb-3'>¡importante!</span>
                            <ul>
                                <li>Esta opción aplicará un descuento de ($15.00) a todo el personal de Base que tenga un credito de INFONAVIT.</li>
                                <li>Al ejecutar esta opción ya no se deberán de hacer más movimientos durante el periodo del Concepto 60.</li>
                            </ul>

                        </div>
                        <FormMaker
                            inputs={[
                                { name: 'oficio', label: 'Oficio*', required: true, onChange: searchCred as any },
                                { name: 'periodo2', label: 'Periodo', keyfilter: 'num', disabled: true, className: 'w-6rem', onMount: setPeriodo },
                                { name: 'fecha_ini2', label: 'Inicio', disabled: true },
                                { name: 'fecha_fin2', label: 'Fin', disabled: true },
                            ]}
                            onSubmit={e => console.log(e)}
                        />
                    </div>
                    : <></>
                }
            </div>

            <div className='mx-auto'>
                <h2 onClick={() => setShowForm1(prev => !prev)}
                    className='bg-gray-200 w-full m-0 p-2 border-round-md flex-center justify-content-between cursor-pointer'
                >
                    Alta INFONAVIT
                    <i className={`pi pi-${showForm1 ? 'minus' : 'plus'}-circle`} />
                </h2>
                {showForm1 ?
                    <div className='bg-gray-100 pt-5 pb-3'>
                        <FormMaker
                            inputs={[
                                { name: 'cred', label: 'Credencial*', keyfilter: 'num', required: true, className: 'w-10rem', onChange: searchCred as any },
                                { name: 'nombre', label: 'Nombre', keyfilter: 'num', disabled: true, className: 'w-20rem' },
                                { name: 'adscripcion', label: 'Adscripcion', keyfilter: 'num', disabled: true, className: 'w-23rem' },
                                { name: 'rfc', label: 'RFC', keyfilter: 'num', disabled: true },
                                { name: 'periodo', label: 'Periodo', keyfilter: 'num', disabled: true, className: 'w-6rem' },
                                { name: 'fecha_ini', label: 'Inicio', disabled: true },
                                { name: 'fecha_fin', label: 'Fin', disabled: true },
                                { name: 'descuento_tipo', label: 'Tipo de descuento', required: true, type:'select', onChange: e => console.log(e), options: [{name: 'Importe', value: 'importe'}, {name: 'Porcentaje', value: 'porcentaje'}, {name: 'UMI', value: 'umi'}] },
                                { name: 'importe', label: 'Cantidad', required: true },
                            ]}
                            onSubmit={e => console.log(e)}
                        />
                    </div>
                    : <></>
                }
            </div>
        </div>

        <div className='max-w-max p-3 mx-auto'>
            
            <TablaCRUD
                data={dataTable}
                cols={[
                    // { field: 'id', header: 'ID' },
                    { field: 'cred', header: 'Credencial' },
                    { field: 'nombre', header: 'Nombre' },
                    { field: 'adscripción', header: 'Adscripción' },
                    { field: 'importe_mensual', header: 'Importe mensual' },
                    { field: 'porcentaje', header: 'Porcentaje' },
                    { field: 'umi', header: 'UMI' },
                    { field: 'num_credito', header: 'Numero de credito', style: { minWidth: '8rem' } },
                    { field: 'fecha_alta', header: 'Fecha alta', style: { minWidth: '6rem' } },
                    { field: 'status', header: 'Estatus' },
                    { field: 'mes_dias', header: 'Dias del mes', style: { minWidth: '8rem' } },
                    { field: 'mes_numero', header: 'Numero del mes', style: { minWidth: '8rem' } },
                ]}
                accion={false}
                dataTableProps={{ resizableColumns: false }}
            />
        </div>

    </>
    )
}




let timerId;
function debounce(callback: () => void, wait: number) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
        callback();
    }, wait);
}
