import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2';

import { apiPostForm, apiGet, apiPutForm } from '../../../../functions/api'
import '../../../../styles/_salaJuntas.scss'

export default function AplicantesCurso(props) {
    const userAuth = useSelector((state) => state.authUser);
    const { closeModal, rh, data, getEnrollUsers, aplicantes } = props;
    console.log(data)
    const [curso, setCurso] = useState()

    useEffect(() => {
        getInfoSalas()
    }, [])

    const getInfoSalas = () => {
        try {
            apiGet('salas', userAuth.access_token)
                .then((response) => {
                    setCurso(response.data.Sala)
                })
        } catch (error) {
            
        }
    }

    const handleAprobar = (e, aplicante, aprobacion) => {
        e.preventDefault();
        
        Swal.fire({
            title: '¿Estas seguro?',
            text: "No podras revertir esta accion!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro!'
        }).then((result) => {
            if (result.isConfirmed) {
                if (aprobacion === true) {
                    aplicante.aprovacion = "aprobado"
                } else {
                    aplicante.aprovacion = "rechasado"
                }
                try {
                    apiPutForm(`salas/aprobacion/${aplicante.id}`,aplicante, userAuth.access_token)
                    .then((response) => {
                        if (aprobacion === true) { 
                            Swal.fire({
                            title: 'Aprobado',
                            text: 'El usuario ha sido aprobado',
                            icon: 'success',
                            timer: 2000
                            })
                        } else {
                            Swal.fire({
                            title: 'Rechazado',
                            text: 'El usuario ha sido rechazado',
                            icon: 'success',
                            timer: 2000
                            })
                        }
                        getEnrollUsers()
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo aprobar el usuario',
                            icon: 'error',
                            timer: 2000
                        })
                    })
                } catch (error) {
                    
                }
            }
        })
    }

    return (
        <div>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Curso</th>
                        <th>Estatus</th>
                        {rh? null : <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {data && data.aprovacion && data.aprovacion.map((item1) => { 
                        return (
                            item1.map((aplicante, index) => { 
                            return (
                                <tr className='table-reservas' key={index}>
                                    <td>{aplicante.user.name}</td>
                                    <td>{curso && curso.map((item) => {
                                        if (item.id === aplicante.id_salas) {
                                            return item.nombre
                                        }
                                    })}</td>
                                    <td>{aplicante.aprovacion === null? "Pendiente": aplicante.aprovacion}</td>
                                    {rh ? null :
                                        aplicante.aprovacion !== null ?
                                            <td>
                                                <div>Ya {aplicante.aprovacion === "aprobado" ? " aprobaste" : " rechazaste"} la postulaciÓn</div>
                                            </td>
                                        :
                                        <td className='btn-aprobacion'>
                                            <button className='btn-danger' onClick={e=>{handleAprobar(e, aplicante, false)}}>Declinar</button>    
                                            <button className='btn-success' onClick={e=>{handleAprobar(e, aplicante, true)}}>Aprobar</button>
                                        </td>
                                    }
                                </tr>
                            )
                        })
                        )
                        
                    }
                    )}
                    {aplicantes && aplicantes.Sala.map((aplicante, index) => {
                        return (
                            <tr className='table-reservas' key={index}>
                                <td>{`${aplicante.nombre} ${aplicante.apellido_paterno} ${aplicante.apellido_materno}`}</td>
                                <td>{curso && curso.map((item) => {
                                    if (item.id === aplicante.id_salas) {
                                        return item.nombre
                                    }
                                })}</td>
                                <td>{aplicante.aprovacion === null? "Pendiente": aplicante.aprovacion}</td>
                            </tr>
                        )

                    })}
                </tbody>
            </table>
        </div>
    )
}