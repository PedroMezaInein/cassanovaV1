import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import './EdithSubpartida.css'
import Update  from '../../Lottie/Update'
import { apiPutForm } from '../../../functions/api'

import sweetalert from 'sweetalert2'
import $ from 'jquery'

function EdithSubpartida ( {subpartida, closeSubpartida} ){
    const authUser = useSelector(state => state.authUser.access_token)
    const [subPartida, setSubPartida] = useState(subpartida)
    const handleChange =  (e) => {
        e.preventDefault()
        setSubPartida( {
            ...subPartida,
            nombre: e.target.value
        } )
    }

    const reloadTableSub = () => {
        $(`#kt_datatable_partidas`).DataTable().ajax.reload()
      }

    const handleSubmit = async (e) => { 
        e.preventDefault()
        let nombre = {
            subpartida:subPartida.nombre,
            subpartida_id:subPartida.id
        }
        
        try {
            apiPutForm(`v2/catalogos/partidas/subpartida/${subPartida.id}`, nombre, authUser)
            .then(res => {
                sweetalert.fire({
                    icon: 'success',
                    title: 'Subpartida actualizada',
                    showConfirmButton: false,
                    timer: 1500
                })
                closeSubpartida()
                reloadTableSub()
            })
            
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="container-subpartida">
            <div className = 'animacion-subpartida'>
                <Update />
            </div>
            <div className = 'titulo-subpartida'>Editar Sub Partida</div>
            <input onChange = {e => handleChange(e)} type='text' value = {subPartida.nombre}></input> 
            <div className='btn-subpartida-container'>
                <button className='btn-subpartida-close' onClick={e => closeSubpartida()}>Cancelar</button>
                <button className="btn-subpartida" onClick={e => handleSubmit(e)}>Guardar</button>
            </div>
        </div>
    )
}

export { EdithSubpartida };