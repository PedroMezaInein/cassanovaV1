import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import axios from 'axios'

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiGet } from '../../../functions/api'
import { URL_DEV } from './../../../constants'
import { setOptions } from '../../../functions/setters'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Layout from '../../../components/layout/layout'
import NuevoTicket from './NuevoTicket'
import EditarTicket from './EditarTicket'
import VerTicket from './VerTicket'
import AprobarTicket from './Modales/AprobarTicket'


import Style from './Modales/TicketsTi.module.css'

export default function TicketsUserTable() {

    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState(false)

    const [modal, setModal] = useState({
        crear: {
            show: false,
            data:false
        },
        editar: {
            show: false,
            data:false
        },
        ver: {
            show: false,
            data:false
        }, 
        aprobar: {
            show: false,
            data:false
        }, 
        cancelar: {
            show: false,
            data:false
        }, 
    })

    let prop = {
        pathname: '/ti/tickets-usuario',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'Fecha', identificador: 'fecha' },
        { nombre: 'Tipo', identificador: 'tipo_view' },
        { nombre: 'Estatus', identificador: 'estatus_view' },
        { nombre: 'Autorización', identificador: 'aprobacion' },
        { nombre: 'F. de entrega', identificador: 'fecha_entrega' },
    ];

    const handleOpenModal = (tipo, data) => {
        setModal({
            ...modal,
            [tipo]: {
                show: true,
                data: data
            }
        })
    }

    const createAcciones = () => {
        return [
            /* {
                nombre: 'editar',
                icono: 'fas fa-edit',
                color: 'yellowButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        editar: {
                            show: true,
                            data: item
                        }
                    })
                }
            }, */
            {
                nombre: 'aprobar',
                icono: 'fas fa-check',
                color: 'blueButton',
                funcion: (item) => {
                    if(item.estatus === "0") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ya fue autorizado',
                        })
                    } else {
                        handleOpenModal('aprobar', item)
                    }
                }
            },
            {
                nombre: 'ver',
                icono: 'fas fa-eye',
                color: 'blueButton',
                funcion: (item) => {
                    setModal({
                        ...modal,
                        ver: {
                            show: true,
                            data: item
                        }
                    })
                }
            },
        ]
    }

    const handleOpen = [
        {
            nombre: 'Nuevo ticket',
            funcion: (item) => {
                setModal({
                    ...modal,
                    crear: {
                        show: true,
                        data: item
                    }
                })
            }
        },
    ]

    let handleClose = (tipo) => () => {
        setModal ({
            ...modal,
            [tipo]: {
                show:false,
                data:false
            }
        })
    }

    const aprobarTicket = (e, data)=>{

        Swal.fire({
            title: '¿Estás seguro de aprobar las funcionalidades?',
            icon: 'question',
            text: 'Una vez aprobado no se podrá modificar',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            
          }).then((result) => {
            console.log(result)
            if (result.isConfirmed) {
                Swal.fire('Se aprobó con éxito', '', 'success') 
            }
            else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }

    const cancelarTicket = (e, data)=>{
        console.log(data)

        Swal.fire({
            title: '¿Estás seguro de cancelar el ticket?',
            icon: 'question',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            
          }).then((result) => {
            console.log(result)
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                // let form = {
                //     estatus: 'aprobado',
                //     id_ticket: data.id,
                // }
                // postAprobacion(form,data.id)
                Swal.fire('Ticket cancelado', '', 'success') 
            }
            else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }

    const ProccessData = (data) => {
        let aux = []
        data.ti.map((item) => {
            aux.push({
                departamento: item.departamento,
                descripcion: item.descripcion,
                estatus_view: setEstatus(item.estatus),
                estatus: item.estatus,
                tipo_view: setTipo(item.tipo),
                tipo: item.tipo,
                fecha: item.fecha,
                fecha_entrega: item.fecha_entrega ? item.fecha_entrega : 'por definir',
                id: item.id,
                aprobacion: item.autorizacion ? <span className={Style.autorizado}>Aprobado</span> : <span className={Style.pendiente}>pendiente</span>,
            })
        })
        aux = aux.reverse()
        return aux
    }

    const setTipo = (data) => { 
        if(data === '0') {
            return 'cambio'
        } else if(data === '1') {
            return 'soporte'
        } else if(data === '2') {
            return 'mejora'
        } else if (data === '3') {
            return 'reporte'
        } else  if (data === '4') {
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
        if(data === '0') {
            return 'Solicitado'
        } else if(data === '1') {
            return 'Solicitado'
        } else if(data === '2') {
            return 'En desarrollo'
        } else if (data === '3') {
            return 'Terminado'
        } else  if (data === '4') {
            return 'Cancelado'
        } else if (data === '5') {
            return 'Rechazado'
        }
    }

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='rh'> 
                <TablaGeneral 
                    titulo='Tickets' 
                    columnas={columnas} 
                    url='ti' 
                    ProccessData={ProccessData} 
                    numItemsPagina={12} 
                    acciones={createAcciones()}  
                    opciones={handleOpen}
                    reload={setReloadTable} 
                />

                <Modal size="lg" title={"Nuevo ticket"} show={modal.crear.show} handleClose={handleClose('crear')}>
                    <NuevoTicket handleClose={handleClose('crear')} reload={reloadTable}/>
                </Modal>

                <Modal size="lg" title={"editar ticket"} show={modal.editar.show} handleClose={handleClose('editar')}>
                    <EditarTicket data={modal.editar.data} handleClose={handleClose('editar')} reload={reloadTable}/>
                </Modal>

                <Modal size="lg" title={"ver ticket"} show={modal.ver.show} handleClose={handleClose('ver')}>
                    <VerTicket data={modal.ver.data} handleClose={handleClose('ver')} reload={reloadTable}/>
                </Modal> 

                <Modal size="md" title={"aprobar Funcionalidades"} show={modal.aprobar.show} handleClose={handleClose('aprobar')}>
                    <AprobarTicket data={modal.aprobar.data} handleClose={handleClose('aprobar')} reload={reloadTable}/>
                </Modal>
            </Layout>  
        </>
    );
}