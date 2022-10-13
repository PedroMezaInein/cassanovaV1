import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import './EdithSubpartida.css'
import Update  from '../../Lottie/Update'
import { apiPutForm } from '../../../functions/api'

import sweetalert from 'sweetalert2'
import $ from 'jquery'

function EdithSubArea ( {subarea, closeSubArea} ){
    const authUser = useSelector(state => state.authUser.access_token)
    const [subArea, setSubArea] = useState(subarea)
    const handleChange =  (e) => {
        e.preventDefault()
        setSubArea( {
            ...subArea,
            nombre: e.target.value
        } )
    }

     const reloadTableSub = () => {
         $(`#kt_datatable_partidas`).DataTable().ajax.reload()
        }

    const handleSubmit = async (e) => { 
        e.preventDefault()
        let nombre = {
            subarea:subArea.nombre,
            subarea_id:subArea.id
        }
        
        try {
            sweetalert.fire({
                title: 'Actualizando Sub Area',
                html: 'Espere por favor',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    sweetalert.showLoading()
                },
                timer:1500
            })
            closeSubArea()

            apiPutForm(`v2/catalogos/areas/subareas/${subArea.id}`, nombre, authUser)
            .then(res => {
                sweetalert.fire({
                    icon: 'success',
                    title: 'Subarea actualizada',
                    showConfirmButton: false,
                    timer: 1500
                })
                reloadTableSub()
            })
            
        } catch (error) {
            console.log(error)
            sweetalert.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: 'No se pudo actualizar la subarea',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }
    return (
        <div className="container-subpartida">
            <div className = 'animacion-subpartida'>
                <Update />
            </div>
            <div className = 'titulo-subpartida'>Editar Sub area</div>
            <input onChange = {e => handleChange(e)} type='text' value = {subArea.nombre}></input> 
            <div className='btn-subpartida-container'>
                <button className='btn-subpartida-close' onClick={e => closeSubArea()}>Cancelar</button>
                <button className="btn-subpartida" onClick={e => handleSubmit(e)}>Guardar</button>
            </div>
        </div>
    )
}

export { EdithSubArea };