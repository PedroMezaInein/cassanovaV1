import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { apiGet } from '../../../functions/api'
import Swal from 'sweetalert2'


import style from './../../../pages/Administracion/RequisicionCompras/Modales/Ver'

import Style from './Modales/TicketsTi.module.css'

export default function VerTicket({ data }) {
    const authUser = useSelector(state => state.authUser)
    const [form, setForm] = useState({
        funcionalidades: [],
    })

    useEffect(() => {
        getFuncionalidades()
    }, [])
    
    const getFuncionalidades = () => {
        apiGet(`ti/funcionalidad/${data.id}`, authUser.access_token)
            .then((data) => {
                Swal.close()
                setForm({
                    ...form,
                    funcionalidades: data.data.funcionalidades,
                })
            })
            .catch((error) => {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal',
                })
            })
    }

    const setTipo = (data) => {
        if (data === '0') {
            return 'cambio'
        } else if (data === '1') {
            return 'soporte'
        } else if (data === '2') {
            return 'mejora'
        } else if (data === '3') {
            return 'reporte'
        } else if (data === '4') {
            return 'información'
        } else if (data === '5') {
            return 'capacitación'
        } else if (data === '6') {
            return 'funcionalidad'
        } else if (data === '7') {
            return 'proyecto'
        }
    }

    const setEstatus = (data) => {
        if (data === '0') {
            return 'Solicitado'
        } else if (data === '1') {
            return 'Solicitado'
        } else if (data === '2') {
            return 'En desarrollo'
        } else if (data === '3') {
            return 'Terminado'
        } else if (data === '4') {
            return 'Cancelado'
        } else if (data === '5') {
            return 'Rechazado'
        }
    }
    
    
    return (
        <>
            <div className='row ml-10 mt-2'>

                <div className='col-6'>
                    <div className={style.container}>

                        <div>
                            <span>
                                Fecha de petición:
                            </span>
                            <p>{` ${data.fecha}`}</p>
                        </div>

                        <div>
                            <span>
                                Tipo de ticket:
                            </span>
                            <p>{setTipo(data.tipo)}</p>
                        </div>

                        <div>
                            <span>
                                Estatus:
                            </span>
                            <p>{setEstatus(data.estatus)}</p>
                        </div>

                       
                    </div>
                </div>

                <div ClassName='mt-10'>
                    <div> 
                        <span>
                            Descripción:
                        </span>
                        <p>{`${data.descripcion}`}</p>
                    </div>

                    <div>
                        <span>
                            Aprobación:
                        </span>
                        <p>
                            {/* {`Compras: ${data.auto1 && data.auto1.name ? data.auto1.name : 'Pendiente'}`} */}
                            {data.autorizacion ? <span className={Style.autorizado}>Aprobado</span> : <span className={Style.pendiente}>pendiente</span>}
                        </p>
                    </div>

                    <div>
                        <span>
                        Fecha de entrega
                        </span>
                        <p>{`${data.fecha_entrega}`}</p>
                    </div>

                </div>

                <div>
                    <span>
                        Funcionalidades:
                    </span>
                    <div>
                        {
                            form.funcionalidades.length > 0 ?
                                form.funcionalidades.map((item, index) => (
                                    <div key={index} className={Style.containerFuncionalidad}><span className={Style.textFuncionalidad}>{item.descripcion}</span></div>
                                ))
                                : <div>No hay funcionalidades</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )

    
}