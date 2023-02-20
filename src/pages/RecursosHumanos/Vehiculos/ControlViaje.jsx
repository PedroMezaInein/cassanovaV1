import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'
import { apiPutForm } from './../../../functions/api'
import moment from "moment";

import './../../../styles/_controlViaje.scss'

export default function ControlViaje (props) {
    const userAuth = useSelector((state) => state.authUser);
    const { reload, data, handleClose } = props
    // console.log(new Date().getTime()/1000)
    const startTravel = (e,viaje) => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        }) 
        
            let newForm = {
                // inicio_viaje: now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
                inicio_viaje: moment().format("DD-MM-YYYY hh:mm:ss")
            }

            apiPutForm(`vehiculos/viaje/${viaje.id}`, newForm, userAuth.access_token)
            .then((response)=>{
                Swal.fire({
                    icon: 'success',
                    title: 'viaje iniciado',
                    text: '¡Buen viaje!',
                    timer: 2000,
                    timerProgressBar: true,
                })
                .then(() => {
                    if (reload) {
                        reload.reload()
                    }
                    handleClose()
                })
            }) 
            .catch((error)=>{  
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
            }) 
    } 

    const endTravel = (e, viaje) => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
            }) 

            let newForm = {
                fin_viaje: moment().format("DD-MM-YYYY hh:mm:ss")
            }

            apiPutForm(`vehiculos/viaje/${viaje.id}`, newForm, userAuth.access_token)
            .then((response)=>{
                Swal.fire({
                    title: 'Finalizar',
                    text: '¡listo! has concluido con el viaje',
                    icon: 'success',
                    showConfirmButton: true,
                    timer: 2000,
                }).then(() => {
                    if (reload) {
                        reload.reload()
                    }
                    handleClose()
                })
            }) 
            .catch((error)=>{  
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
            }) 
    }
    
    return (
        <>
            {
                data.inicio_viaje ? 
                    <>
                        <div>
                           <span>¿Estás seguro de concluir el viaje?</span> 
                           <div className='control_botones'>
                                <button onClick={e => endTravel(e,data)}>finalizar</button>
                                <button onClick={handleClose}>cancelar</button>
                           </div>
                        </div> 
                    </>
                :
                    <>
                        <div>
                           <span>¿Deseas iniciar el viaje?</span> 
                           <div className='control_botones'>
                                <button onClick={e => startTravel(e,data)}>iniciar</button>
                                <button onClick={handleClose}>cancelar</button>
                           </div>
                        </div> 
                    </>
            }
        </>
    )
}