import React from 'react'
import { useState } from 'react'
import {  useSelector } from "react-redux";

import $ from 'jquery'
import swal from 'sweetalert2'

import{ printResponseErrorAlert } from './../../../../functions/alert'
import { apiPutForm } from '../../../../functions/api';

import './../../../../styles/_modal_form.scss'

export default function EdithEquipoForm({props}){
    const { id, equipo, marca, modelo, serie, descripcion, empleado_id } = props
    const authUser = useSelector(state => state.authUser.access_token);
    const [equipoForm, setEquipoForm] = useState({
        id: id,
        equipo: equipo,
        marca: marca,
        modelo: modelo,
        serie: serie,
        descripcion: descripcion,
        empleado_id: empleado_id
    })

    const [errores, setErrores] = useState({})

    const validateForm = () => {
        let validacionError = true
        let errors = {}
        if (equipoForm.equipo === '') {
            errors.equipo = 'El equipo es requerido'
            validacionError = false
        }
        if (equipoForm.marca === '') {
            errors.marca = 'La marca es requerida'
            validacionError = false
        }
        if (equipoForm.modelo === '') {
            errors.modelo = 'El modelo es requerido'
            validacionError = false
        }
        if (equipoForm.serie === '') {
            errors.serie = 'La serie es requerida'
            validacionError = false
        }
        if (equipoForm.descripcion === '') {
            errors.descripcion = 'La descripción es requerida'
            validacionError = false
        }
        setErrores(errors)
        return validacionError
    }

    const handleChange = (e) => {
        setEquipoForm({
            ...equipoForm,
            [e.target.name]: e.target.value
        })
    }

    const reloadTableEquipos = (filter) => {
        $(`#equipos`).DataTable().search(JSON.stringify(filter)).draw();
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(validateForm()){
            try {
                apiPutForm(`v1/administracion/equipos/${equipoForm.id}`, equipoForm, authUser)
            .then(response => {
                reloadTableEquipos({})

                setErrores({})
                    swal.fire({
                    icon: 'success',
                    title: 'Equipo actualizado',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(error => { 
                printResponseErrorAlert(error)
            })
            } catch (error) {
                printResponseErrorAlert(error)
            }
        }else{
            console.log(errores)
        }
    }
            


    return(
        <div>
            <form>
                <div className = 'form-container'>
                    <div>
                        <label>Equipo</label>
                        <input type="text" name="equipo" value={equipoForm.equipo} onChange={e => handleChange(e)}/>
                        {errores.equipo && <p>{errores.equipo}</p>}
                    </div>
                    <div>
                        <label>Modelo</label>
                        <input type="text" name="modelo" value={equipoForm.modelo} onChange={e => handleChange(e)}/>
                        {errores.modelo && <p>{errores.modelo}</p>}
                    </div>
                    <div>
                        <label>Marca</label>
                        <input type="text" name="marca" value={equipoForm.marca} onChange={e => handleChange(e)}/>
                        {errores.marca && <p>{errores.marca}</p>}
                    </div>
                    <div>
                        <label>Numero de serie</label>
                        <input type="text" name="serie" value={equipoForm.serie} onChange={e => handleChange(e)}/>
                        {errores.serie && <p>{errores.serie}</p>}
                    </div>

                </div>
                <div className = 'text-container-textarea'>
                    <label>Descripcion</label>
                    <textarea name="descripcion" value={equipoForm.descripcion} onChange={e => handleChange(e)}/>
                    {errores.descripcion && <p>{errores.descripcion}</p>}
                </div>
            </form>
            <hr className='line'/>
            <div className='btn'>
                <button onClick={ e => handleSubmit(e) }>Guardar</button>
            </div>
        </div>
    )
}