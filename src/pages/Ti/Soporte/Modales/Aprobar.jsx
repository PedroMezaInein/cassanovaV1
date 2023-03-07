import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { apiPostForm } from '../../../../functions/api'
import Style from './TicketsTi.module.css'

export default function Aprobar(props) { 
    const { reload, handleClose, data } = props
    const userAuth = useSelector((state) => state.authUser);
    const [form, setForm] = useState({
        monto: 0,
    })

    /* const [errores, setErrores] = useState({})

    const handleMoney = (e) => {
        setForm({
            ...form,
            monto: e
        })
    }

    const validate = () => {
        let errores = {}
        let formOk = true
        if (form.monto === 0) {
            formOk = false
            errores.monto = 'El monto no puede ser 0'
        }
        setErrores(errores)
        return formOk
    } */

    const handleSubmit = (e) => { 
        if (validate()) { 
            Swal.fire({
                title: 'Autorizando ticket de sopote',
                text: "¿Estas seguro de autorizar este ticket de soporte?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, autorizar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Autorizando ticket de sopote',
                        text: "Por favor espere...",
                        icon: 'info',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        showConfirmButton: false,
                    })
                    try {
                        apiPostForm(`computo/autorizar/${data.id}`, {}, userAuth.access_token)
                            .then((res) => {
                                Swal.fire({
                                    title: 'Ticket de soporte aprobado',
                                    text: "El ticket de soporte ha sido aprobado",
                                    icon: 'success',
                                })
                                if (reload) {
                                    reload.reload()
                                }
                                handleClose()
                            })
                    } catch (error) {
                        Swal.fire({
                            title: 'Error',
                            text: "Ha ocurrido un error al aprobar el ticket de soporte",
                            icon: 'error',
                        })
                    }
                }
            })    
        } else {
            Swal.fire({
                title: 'Faltan campos por llenar',
                text: "Por favor llena todos los campos",
                icon: 'warning',
            })
        }
      
    }

    return (
        <>

            <div className="row justify-content-center">
                <div className="col-md-4">
                    <button className={Style.sendButton} type="submit" onClick={handleSubmit}>Aprobar</button>
                </div>
            </div>

            
        </> 
    )
}