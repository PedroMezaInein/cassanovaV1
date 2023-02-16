import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'
import { apiPutForm } from './../../../functions/api'

import './../../../styles/_controlViaje.scss'

export default function ControlViaje (props) {
  const userAuth = useSelector((state) => state.authUser);
  const { reload, data, handleClose } = props
  console.log(data)

    const startTravel = (e,viaje) => {
        
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        }) 
        
        try {
            
            let now = new Date()

            let newForm = {
                inicio_viaje: now.getHours() + ':' + now.getMinutes()
            }

            apiPutForm(`vehiculos/viaje/${viaje.id}`, newForm, userAuth.access_token)
                .then((response)=>{
                    Swal.close()
                    Swal.fire({
                        icon: 'success',
                        title: 'viaje iniciado',
                        text: '¡Buen viaje!',
                        timer: 5000,
                        timerProgressBar: true,
                    })
                    handleClose()
                    if(reload){
                        reload.reload()
                    }
                })
                .catch((error) => {
                    Swal.close()
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ha ocurrido un error 1',
                    })
                    console.log(error)
                })
        } catch (error) { 
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ha ocurrido un error 2',
            })
        }  
    } 
    // const startTravel = (e,viaje) => {
    //     Swal.fire({
    //         title: 'Cargando...',
    //         allowOutsideClick: false,
    //         onBeforeOpen: () => {
    //             Swal.showLoading()
    //         }
    //     }) 
        
    //         let now = new Date()

    //         let newForm = {
    //             inicio_viaje: now.getHours() + ':' + now.getMinutes()
    //         }

    //         apiPutForm(`vehiculos/viaje/${viaje.id}`, newForm, userAuth.access_token)
    //         .then((response)=>{
    //             Swal.close()
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: 'viaje iniciado',
    //                 text: '¡Buen viaje!',
    //                 timer: 2000,
    //                 timerProgressBar: true,
    //             })
    //             handleClose()
    //             if(reload){
    //                 reload.reload()
    //             }
    //         }) 
    //         .catch((error)=>{  
    //             Swal.close()
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: 'Ha ocurrido un error',
    //             })
    //         }) 
    // } 

    const endTravel = (e, viaje) => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
            }) 
            
            let now = new Date()

            let newForm = {
                fin_viaje: now.getHours() + ':' + now.getMinutes()
            }

            apiPutForm(`vehiculos/viaje/${viaje.id}`, newForm, userAuth.access_token)
            .then((response)=>{
                Swal.close()
                Swal.fire('¡listo! has concluido con el viaje', '', 'success')
                if(reload){
                    reload.reload()
                }
                handleClose()
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
                        <div className='control_viaje'>
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
                           <div>
                                <button onClick={e => startTravel(e,data)}>iniciar</button>
                                <button onClick={handleClose}>cancelar</button>
                           </div>
                        </div> 
                    </>
            }
        </>
    )
}