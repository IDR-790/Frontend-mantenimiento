import React, { useEffect, useState } from 'react'
import { FormMaker } from '../../../shared/components/forms/FormMaker'
import { TablaCRUD } from '../../../shared/components/tablas/TablaCRUD';
import data from '../../db/conceptos.json'
 

export const ConceptosPage = () => {
    const [showForm, setShowForm] = useState(false)
    const [dataTable, setDataTable] = useState<any[]>([])
    
    useEffect(() => {
        setDataTable(data.map( (d, i) => ({...d, id: i+1}) ))
    }, [])
    


    return (
    <>
        <h1 className='bg-purple-300 m-0 p-3'>Catalogo de conceptos</h1>

        <div className='p-3 mx-auto' style={{maxWidth: '40rem'}}>
            <TablaCRUD 
                cols={[
                    {field: 'concepto', header: 'concepto'},
                    {field: 'descripcion', header: 'descripcion'},
                ]}
                data={dataTable} 
                accion={false}
            />

            <br />

            <h2 className='bg-gray-200 m-0 p-2 border-round-md flex-center justify-content-between cursor-pointer' onClick={() => setShowForm(prev => !prev) } >Cargar nuevo concepto <i className={`pi pi-${showForm?'minus':'plus'}-circle`} /></h2>
            { showForm ? 
                <div className='bg-gray-100 pt-5 pb-3'>
                    <FormMaker 
                        inputs={[
                            {name: 'concepto', label: 'Concepto', required: true, rules: { validate: (val) => val>dataTable.length+4 || 'Concepto existente'}},
                            {name: 'descripcion', label: 'Descripcion', required: true}
                        ]} 
                        onSubmit={ e => console.log(e)}
                    />
                </div>
                : <></>
            }
        </div>
    </>
    )
}
