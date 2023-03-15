import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import axios from 'axios'

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiDelete } from '../../../functions/api'
import { URL_DEV } from './../../../constants'
import { setOptions } from '../../../functions/setters'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Layout from '../../../components/layout/layout'
import NuevoTicket from './NuevoTicket'
import EditarTicket from './EditarTicket'
import VerTicket from './VerTicket'

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
        { nombre: 'Tipo', identificador: 'tipo' },
        { nombre: 'Estatus', identificador: 'estatus' },
        { nombre: 'Aprobación', identificador: 'aprobacion' },
        // { nombre: 'Funcionalidad', identificador: 'funcionalidad' },
        { nombre: 'F. de entrega', identificador: 'fecha_entrega' },
    ];

   

    
    const createAcciones = () => {
        return [
            {
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
            },
            {
                nombre: 'aprobar',
                icono: 'fas fa-edit',
                color: 'blueButton',
                funcion: (aprobarTicket)
            },
            {
                nombre: 'ver',
                icono: 'fas fa-edit',
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
            {
                nombre: 'cancelar',
                icono: 'fas fa-edit',
                color: 'redButton',
                funcion: (calcelarTicket)
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

    const postAprobacion = (body,id) => {
        axios.put(`${URL_DEV}permiso/solicitudes/autorizar/${id}`, body, { headers: { Authorization: `Bearer ${userAuth}` } })
    }

    const aprobarTicket = (e, data)=>{
        console.log(data)

        Swal.fire({
            title: '¿Estás seguro de aprobar las funcionalidades?',
            icon: 'question',
            // input: 'textarea',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            // denyButtonText: `Don't save`,
            // preConfirm: (value) => {
            //     if (!value) {
            //       Swal.showValidationMessage(
            //         'Por favor deja un comentario'
            //       )
            //     }
            // }
            
          }).then((result) => {
            console.log(result)
            if (result.isConfirmed) {
                // let form = {
                //     estatus: 'aprobado',
                //     id_ticket: data.id,
                // }
                // postAprobacion(form,data.id)
                Swal.fire('Se aprobó con éxito', '', 'success') 
            }
            else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }

    const calcelarTicket = (e, data)=>{
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
                estatus: item.estatus,
                fecha: item.fecha,
                fecha_entrega: item.fecha_entrega,
                id: item.id
            })
        })
        return aux
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
            </Layout>  
        </>
    );
}