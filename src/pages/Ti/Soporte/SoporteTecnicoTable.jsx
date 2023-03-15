import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { Modal } from '../../../components/singles'
import TablaGeneral from '../../../components/NewTables/TablaGeneral/TablaGeneral'
import { apiPostForm, apiDelete } from '../../../functions/api'
import { setOptions } from '../../../functions/setters'
import useOptionsArea from '../../../hooks/useOptionsArea'
import Layout from '../../../components/layout/layout'

import Adjuntos from './Adjuntos/Adjuntos'
import Editar from './Modales/Editar'
import Nuevo from './Modales/Nuevo'
import Ver from './Modales/Ver'
/* import Aprobar from './Modales/Aprobar' */

import Style from './SoporteTecnico.module.css'

export default function SoporteTecnicoTable() {
    const userAuth = useSelector((state) => state.authUser);
    const [reloadTable, setReloadTable] = useState(false)
    const [modal, setModal] = useState({
        editar: {
            show: false,
            data: false
        },
        ver: {
            show: false,
            data: false
        },
        adjuntos: {
            show: false,
            data: false
        },
        crear: {
            show: false,
            data: false
        },
        aprobar: {
            show: false,
            data: false
        }
    })

    let prop = {
        pathname: '/ti/soporte',
    }

    const columnas = [
        { nombre: 'Acciones', identificador: 'acciones' },
        { nombre: 'F. solicitud', identificador: 'fecha' },
        { nombre: 'F. servicio', identificador: 'fecha_servicio' },
        { nombre: 'Equipo', identificador: 'equipo' },
        { nombre: 'Marca', identificador: 'marca' },
        {nombre: 'Monto Autorizado', identificador: 'monto_autorizado'},
        { nombre: 'Autorización', identificador: 'autorizacion' },
    ];

    const opciones = [
        {
            nombre: 'Nuevo soporte',
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

    const ProccessData = (data) => {
        let aux = []
        console.log(data)
        data.computo.forEach((item) => { 
            aux.push({
                aprobacion: item.aprobacion,
                fecha: reformatDate(item.fecha),
                acciones: createAcciones(),
                fecha_servicio: reformatDate(item.fecha_mantenimiento),
                autorizacion: viewAprobacion(item),
                monto_autorizado: `$${item.costo}`,
                equipo: item.equipo.length > 10 ? item.equipo.substring(0, 10) + '...' : item.equipo,
                marca: item.marca.length > 15 ? item.marca.substring(0, 15) + '...' : item.marca,
                id: item.id,
                id_equipo: item.id_equipo,
                id_usuario: item.id_usuario,
                usuario: item.usuario,
                costo: item.costo,
                descripcion: item.descripcion,
            })
        })
        aux = aux.reverse()
        return aux
    }

    function reformatDate(dateStr) {
        var dArr = dateStr.split("-");  // ex input: "2010-01-18"
        return dArr[2] + "/" + dArr[1] + "/" + dArr[0]/* .substring(2) */; //ex output: "18/01/10"
    }

    const viewAprobacion = (item) => { 
        if (item.aprobacion) {
            return <span className={Style.autorizado}>Aprobado</span>
        } else {
            return <span className={Style.pendiente}>Pendiente</span>
        }
    }

    const autorizar = (data) => { 
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
                            if (reloadTable) {
                                reloadTable.reload()
                            }
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
    }

    const handleDelete = (data) => {
        Swal.fire({
            title: 'Eliminando ticket de sopote',
            text: "¿Estas seguro de eliminar este ticket de soporte?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Eliminando ticket de sopote',
                    text: "Por favor espere...",
                    icon: 'info',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false,
                })
                try {
                    apiDelete(`computo/${data.id}`, userAuth.access_token)
                        .then((res) => {
                            Swal.fire({
                                title: 'Ticket de soporte eliminado',
                                text: "El ticket de soporte ha sido eliminado",
                                icon: 'success',
                            })
                            if (reloadTable) {
                                reloadTable.reload()
                            }
                        })
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: "Ha ocurrido un error al eliminar el ticket de soporte",
                        icon: 'error',
                    })
                }
            }
        })
    }


    const createAcciones = () => {
        return [
            {
                nombre: 'Editar',
                icono: 'fas fa-edit',
                color: 'blueButton',
                funcion: (item) => {
                    if (item.aprobacion) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No puedes editar un ticket de soporte aprobado',
                        })
                    } else {
                        handleOpenModal('editar', item)  
                    }
                    
                }
            },
            {
                nombre: 'Adjuntos',
                icono: 'fas fa-paperclip',
                color: 'blueButton',
                funcion: (item) => {
                    handleOpenModal('adjuntos', item)
                }
            },
            {
                nombre: 'Aprobar',
                icono: 'fas fa-check',
                color: 'greenButton',
                funcion: (item) => {
                    if (userAuth.user.tipo.id === 1) {
                        autorizar(item)
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No tienes permisos para aprobar tickets',
                        })
                    }
                }
            },
            {
                nombre: 'Eliminar',
                icono: 'fas fa-trash',
                color: 'redButton',
                funcion: (item) => {
                    if (userAuth.user.tipo.id === 1) {
                        handleDelete(item)
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No tienes permisos para eliminar tickets',
                        })
                    }
                }
            }

        ]
    }

    const handleOpenModal = (tipo, data) => {
        setModal({
            ...modal,
            [tipo]: {
                show: true,
                data: data
            }
        })
    }

    return (
        <>
            <Layout authUser={userAuth.acces_token} location={prop} history={{ location: prop }} active='ti'>
                <>
                    <TablaGeneral titulo='Soporte ' columnas={columnas} url='computo' ProccessData={ProccessData} numItemsPagina={10} acciones={createAcciones()} reload={setReloadTable} opciones={opciones} />
                </>
            </Layout>
            
            {
                modal.editar.data &&
                <Modal size="lg" show={modal.editar.show} handleClose={() => setModal({ ...modal, editar: { show: false, data: modal.editar.data} })} title='Editar ticket'>
                    <Editar data={modal.editar.data} reload={reloadTable} handleClose={() => setModal({ ...modal, editar: { show: false} })} />
                </Modal>

            }
            
            <Modal show={modal.ver.show} handleClose={() => setModal({ ...modal, ver: { show: false, data: modal.ver.data } })} title='Ver ticket'>
                <Ver data={modal.ver.data} />
            </Modal>

            <Modal size="lg" show={modal.adjuntos.show} handleClose={() => setModal({ ...modal, adjuntos: { show: false, data: false } })} title='Adjuntos'>
                <Adjuntos data={modal.adjuntos.data} reload={reloadTable} handleClose={() => setModal({ ...modal, adjuntos: { show: false, data: false } })} />
            </Modal>

            <Modal size="lg" show={modal.crear.show} handleClose={() => setModal({ ...modal, crear: { show: false, data: false } })} title='Nuevo mantenimiento'>
                <Nuevo reload={reloadTable} handleClose={() => setModal({ ...modal, crear: { show: false, data: false } })} />
            </Modal>

            {/* <Modal size="md" show={modal.aprobar.show} handleClose={() => setModal({ ...modal, aprobar: { show: false, data: false } })} title='Aprobar Mantenimiento'>
                <Aprobar data={modal.aprobar.data} reload={reloadTable} handleClose={() => setModal({ ...modal, aprobar: { show: false, data: false } })} />
            </Modal> */}
        </>
    );
}