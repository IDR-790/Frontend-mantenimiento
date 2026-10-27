import React, { useEffect, useState } from 'react'
import { FormMaker } from '../../../shared/components/forms/FormMaker'
import { TablaCRUD } from '../../../shared/components/tablas/TablaCRUD';
import data from '../../db/periodos.json'
import { FileUpload } from 'primereact/fileupload';
import { UploadTemplate } from '../../../shared/components/uploaders/UploadTemplate';
 

export const PeriodosPage = () => {
    const [showForm, setShowForm] = useState(false)
    const [dataTable, setDataTable] = useState<any[]>([])
    
    useEffect(() => {
        // console.log(data);
        setDataTable(data)
    }, [])
    


    return (
    <>
        <h1 className='bg-purple-300 m-0 p-3'>Catalogo de periodos</h1>

        <div className='mx-auto p-3' style={{width: '64rem'}}>
            <TablaCRUD 
                data={dataTable} 
                cols={[
                    {field: 'id', header: 'ID'},
                    {field: 'numero', header: '#'},
                    {field: 'tipo', header: 'Tipo'},
                    {field: 'aho', header: 'Año'},
                    {field: 'fecha_inicio', header: 'Fecha inicio'},
                    {field: 'fecha_final', header: 'Fecha final'},
                    {field: 'estado', header: 'Estado'},
                    {field: 'imss_días_pago', header: 'IMSS días de pago', style:{minWidth: '8rem'} },
                    {field: 'bimestre_dias', header: 'Bimestre dias', style:{minWidth: '6rem'}},
                    {field: 'despensa', header: 'Despensa'},
                    {field: 'mes_dias', header: 'Dias del mes', style:{minWidth: '8rem'}},
                    {field: 'mes_numero', header: 'Numero del mes', style:{minWidth: '8rem'}},
                ]}
                accion={false}
                dataTableProps={{ resizableColumns: false }}
            />

            <br />

            <div className='mx-auto' style={{ maxWidth: '50rem' }}>
                <h2 className='bg-gray-200 m-0 p-2 border-round-md flex-center justify-content-between cursor-pointer' onClick={() => setShowForm(prev => !prev) } >Alta de periodos <i className={`pi pi-${showForm?'minus':'plus'}-circle`} /></h2>
                { showForm ? 
                    <div className='bg-gray-100 p-5 flex-center'>
                       <UploadTemplate customUploader={ e => console.log(e)} />
                    </div>
                    : <></>
                }
            </div>
        </div>
    </>
    )
}