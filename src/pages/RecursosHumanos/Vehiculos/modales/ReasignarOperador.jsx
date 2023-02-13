import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { apiGet, apiPostForm, apiPutForm } from '../../../../functions/api'

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Style from './NuevoVehiculo.module.css'

export default function ReasignarOperador(props) {
    const { vehiculos, data, reload, handleClose } = props
    console.log(data)
    const authUser = useSelector(state => state.authUser)
    const usuarios = useSelector(state => state.opciones.vehiculos.asignacion)
    const [form, setForm] = useState({
        ...data.data,
    })
    const [vehiculo, setVehiculo] = useState({
        id_vehiculo: data.data.vehiculo ? data.data.vehiculo.id : '',
    })
    console.log(usuarios)

    const handleChange = (e) => {
        let aux = usuarios.find(item => item.id_vehiculo === e.target.value)
        setForm({
            ...form,
            id_vehiculo: aux.id_vehiculo,
            conductor: aux.usuario
        })
        setVehiculo({
            id_vehiculo: aux.id_vehiculo,
        })
    }
    
    const handleSubmit = (e) => { 
        Swal.fire({
            title: '¿Re-asignar vehiculo?',
            text: "¿Estas seguro de re-asignar el vehiculo?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Re-asignar'
        }).then((result) => {
            if (result.isConfirmed) {   
                Swal.fire({
                    title: 'Re-asignando vehiculo',
                    text: 'Espere un momento por favor',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    }

                })
                try {
                    apiPutForm(`vehiculos/solicitud/edit/${data.data.id}`, form, authUser.access_token)
                        .then((res) => { 
                            reload.reload()
                            Swal.fire({
                                title: 'Re-asignado',
                                text: 'Vehiculo re-asignado correctamente',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            handleClose()

                    })
                } catch (error) {
                    console.log(error)
                }
            }
        })
        
    }

    return (
        <>
            <div>
                <div>
                    <InputLabel id="demo-simple-select-label">Camioneta</InputLabel>
                    <Select
                        value={vehiculo.id_vehiculo}
                        name="id_vehiculo"
                        onChange={handleChange}
                    >
                        {usuarios.map((item) => (
                            <MenuItem key={item.id} value={item.id_vehiculo}>{item.vehiculos.marca} {item.vehiculos.modelo} - {item.user.name} </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>
            <div className="row justify-content-end">
                <div className="col-md-4">
                    <button className={Style.sendButton} onClick={handleSubmit}>Re-asignar</button>
                </div>
            </div>

        </>
    )
}