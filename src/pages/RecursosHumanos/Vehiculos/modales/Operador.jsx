import React from 'react'
import TablaOperadores from './../TablaOperadores'

export default function EditarVehiculo(props) {
    const {  vehiculo } = props

    return (
        <>
            <TablaOperadores id={vehiculo.id} />
            
        </>
    )
}