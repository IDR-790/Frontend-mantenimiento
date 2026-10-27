import React from 'react'
import { DynamicInput, MiniFormMaker } from './MiniFormMaker'
import { useForm } from 'react-hook-form'
import { Button } from 'primereact/button'



interface Props<T> {
    inputs: DynamicInput[],
    onSubmit: (data: T) => void
}


export const FormMaker = <T extends {}>({ 
    inputs,
    onSubmit
}: Props<T>) => {
    const form = useForm<T>()
    
    return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='flex-center gap-3 row-gap-5' >
        <MiniFormMaker form={form} inputs={inputs} />

        <div className='w-full flex-center gap-3'>
            <Button type='submit' icon='pi pi-send' severity='success' label='Enviar' />
            <Button type='reset' icon='pi pi-times' severity='danger' label='' />
        </div>
    </form>
    )
}
