import React, { useEffect, useState } from 'react'
import { TablaCRUD } from '../../../shared/components/tablas/TablaCRUD'
import { FormMaker } from '../../../shared/components/forms/FormMaker'
import data from '../../db/valores-globales.json'

export const GlobalesPage = () => {
    const [showForm, setShowForm] = useState(false)
    const [dataTable, setDataTable] = useState<any[]>([])
    useEffect(() => {
        setDataTable(data)
    }, [])
    

    return (
    <>
        <h1 className='bg-purple-300 m-0 p-3'>Catalogo de valores globales</h1>

        <div className='p-3 mx-auto' style={{maxWidth: '40rem'}}>
            <TablaCRUD 
                cols={[
                    {field: 'id', header: '#'},
                    {field: 'descripcion', header: 'descripcion'},
                    {field: 'valor', header: 'valor'},
                ]}
                data={dataTable} 
                accion={false}
            />
            <br />
            <h2 
                className='bg-gray-200 m-0 p-2 border-round-md flex-center justify-content-between cursor-pointer' 
                onClick={() => setShowForm(prev => !prev)} 
            >
                Cargar nuevo valor global 
                <i className={`pi pi-${showForm?'minus':'plus'}-circle`} />
            </h2>
            { showForm ? 
                <div className='bg-gray-100 pt-5 pb-3'>
                    <FormMaker 
                        inputs={[
                            // {name: 'numero', label: 'Numero*', required: true, rules:{ validate: (val) => val>dataTable.length || 'Concepto ya existente' }},
                            {name: 'descripcion', label: 'Descripcion*', required: true},
                            {name: 'valor', label: 'Valor*', keyfilter: 'num', required: true},
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
